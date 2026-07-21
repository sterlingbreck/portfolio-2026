const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;

function json(status: number, body: Record<string, unknown>): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

interface ContactBody {
	email?: unknown;
	message?: unknown;
	turnstileToken?: unknown;
}

interface SiteverifyResult {
	success: boolean;
	'error-codes'?: string[];
}

async function verifyTurnstile(env: Env, token: string, ip: string | null): Promise<boolean> {
	const form = new FormData();
	form.append('secret', env.TURNSTILE_SECRET_KEY);
	form.append('response', token);
	if (ip) form.append('remoteip', ip);

	const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: form,
	});
	const result = (await res.json()) as SiteverifyResult;
	if (!result.success) {
		console.warn('Turnstile verification failed:', result['error-codes']);
	}
	return result.success;
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname !== '/api/contact') {
			return json(404, { error: 'not_found' });
		}
		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
				status: 405,
				headers: { 'Content-Type': 'application/json', Allow: 'POST' },
			});
		}

		let body: ContactBody;
		try {
			body = await request.json<ContactBody>();
		} catch {
			return json(400, { error: 'invalid_json' });
		}

		const email = typeof body.email === 'string' ? body.email.trim() : '';
		const message = typeof body.message === 'string' ? body.message.trim() : '';
		const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';

		if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
			return json(400, { error: 'invalid_email' });
		}
		if (!message || message.length > MESSAGE_MAX) {
			return json(400, { error: 'invalid_message' });
		}
		if (!turnstileToken) {
			return json(400, { error: 'missing_token' });
		}

		const ok = await verifyTurnstile(env, turnstileToken, request.headers.get('CF-Connecting-IP'));
		if (!ok) {
			return json(403, { error: 'turnstile_failed' });
		}

		try {
			await env.CONTACT_EMAIL.send({
				from: { email: env.NOTIFY_FROM, name: 'nyk-nyc.com Contact' },
				to: env.NOTIFY_TO,
				replyTo: email,
				subject: `Portfolio contact from ${email}`,
				text: `From: ${email}\n\n${message}`,
			});
		} catch (err) {
			const e = err as { code?: string; message?: string };
			console.error('Email send failed:', e.code, e.message);
			return json(502, { error: 'send_failed' });
		}

		return json(200, { ok: true });
	},
} satisfies ExportedHandler<Env>;
