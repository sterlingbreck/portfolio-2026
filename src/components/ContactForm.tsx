import { useRef, useState } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { Mail } from 'lucide-react';

// Sitekeys are public; the paired secret lives in the worker (TURNSTILE_SECRET_KEY).
// Widget hostnames: nyk-nyc.com, www.nyk-nyc.com, localhost.
const TURNSTILE_SITE_KEY = '0x4AAAAAAD6vwwRMysaRMlHS';

const FIELD_CLASSES = `w-full bg-white/5 border border-white/10 rounded-md px-3 py-2
  font-body text-sm text-white/90 placeholder:text-white/40
  focus:outline-none focus:border-white/30 transition-colors duration-200`;

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');
  const turnstileRef = useRef<TurnstileInstance>(null);

  const canSubmit =
    status !== 'sending' && email.trim() !== '' && message.trim() !== '' && token !== null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('sending');
    setErrorText('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), message: message.trim(), turnstileToken: token }),
      });
      if (res.ok) {
        setStatus('success');
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setErrorText(
        data.error === 'turnstile_failed'
          ? 'Verification failed — please try again.'
          : 'Something went wrong — you can reach me at sterlingbreck@gmail.com.'
      );
      setStatus('error');
    } catch {
      setErrorText('Something went wrong — you can reach me at sterlingbreck@gmail.com.');
      setStatus('error');
    }
    setToken(null);
    turnstileRef.current?.reset();
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-sm min-h-40 flex flex-col justify-center gap-2">
        <div className="inline-flex items-center gap-2 text-white/80 font-body text-sm">
          <Mail size={16} />
          Thanks — I'll get back to you soon.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3" noValidate>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        aria-label="Your email"
        autoComplete="email"
        maxLength={254}
        required
        disabled={status === 'sending'}
        className={FIELD_CLASSES}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        aria-label="Your message"
        rows={4}
        maxLength={5000}
        required
        disabled={status === 'sending'}
        className={`${FIELD_CLASSES} resize-none`}
      />
      <Turnstile
        ref={turnstileRef}
        siteKey={TURNSTILE_SITE_KEY}
        options={{ theme: 'dark', size: 'flexible' }}
        onSuccess={setToken}
        onExpire={() => setToken(null)}
        onError={() => setToken(null)}
      />
      <button
        type="submit"
        disabled={!canSubmit}
        className="self-start bg-white text-black font-body text-sm px-5 py-2 rounded-md
          hover:bg-white/90 transition-colors duration-200
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {status === 'error' && (
        <p className="font-body text-xs text-white/60" role="alert">
          {errorText}
        </p>
      )}
    </form>
  );
}
