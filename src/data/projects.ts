import type { Project } from '../types';

const imageModules = import.meta.glob('../assets/projects/*.{png,gif,webp,mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function img(name: string): string {
  const url = imageModules[`../assets/projects/${name}`];
  if (!url) throw new Error(`Missing project image: ${name}`);
  return url;
}

export const projects: Project[] = [
  {
    id: 'project-rallybook',
    title: 'Rallybook',
    description:
      'Court booking and payments for tennis and pickleball clubs, with agentic helpers for players and the front desk. Players hold a court while they pay, split the cost by link, and manage bookings from any device. A voice and chat concierge books, changes, and cancels courts by talking or typing, reading back the price before anything is charged. Staff get a live court board, payments and refunds, members, reports, and a guided setup for new clubs.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Agentic AI', 'Voice Concierge', 'Claude Code',
      'Cloudflare D1 SQLite', 'Cloudflare Workers',
      'TypeScript', 'Next.js on Vite', 'Product Design',
      'Speech Recognition', 'Payments', 'Tailwind CSS',
      'Architecture', 'Automation', 'Booking Systems',
    ],
    imageUrls: [
      img('projects-rally-hero.png'),
      img('projects-rally-agent.png'),
      img('projects-rally-payments.png'),
      img('projects-rally-reports.png'),
    ],
    projectLinkLabel: 'In Development',
    year: 'Business Application + Full-Stack Development + Design + CDN Integration',
  },
  {
    id: 'project-2',
    title: 'OBL',
    description:
      'Every code commit is represented in dynamic ways across this multiplayer island world. Created to support open source development and learning, powered by realtime data.  User can speak and interact in realtime while exploring lands and projects built by other open source contributors.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Cloudflare Durable Objects', 'GitHub CI', 'Three.js',
      'Streaming Audio', 'GraphQL', 'Performance Tuning',
      'Architecture', 'Cloudflare D1', 'Cloudflare Access',
      'Web-based games', 'Cloudflare KV', 'Claude Code',
      'GitHub oAuth', 'WebGL2', 'CRON Jobs', 'JavaScript',
      'Automation', 'Cloudflare Workers', 'Wrangler CLI',
    ],
    imageUrls: [
      img('projects-ooga-1.png'),
      img('projects-ooga-2.png'),
      img('projects-ooga-3.png'),
      img('projects-ooga-4.png'),
    ],
    projectUrl: 'https://oogabooga.land/',
    year: 'Open Source Contributor + CDN Backend Architecture + Full-Stack Development + Design',
  },
  {
    id: 'project-1',
    title: 'HumTalk',
    description:
      'Browser-based voice and video application — start a call and anyone can join from a link, with nothing to install and no phone plan needed. Supports one-on-one calls and groups of up to 100 people, with switching between voice and video mid-call. Includes screen sharing, live captions, breakout rooms, recording with transcripts, and waiting rooms.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Realtime Video', 'Realtime Audio', 'Claude Code',
      'Cloudflare D1 SQLite', 'Cloudflare Wrangler CLI',
      'TypeScript', 'Cloudflare Workers', 'JavaScript',
      'Screen Sharing', 'Live Captions', 'GitHub CI',
      'Cloudflare Durable Objects', 'Architecture',
      'Cloudflare KV', 'Automation', 'Performance Tuning',
    ],
    imageUrls: [
      img('projects-hum-1.png'),
      img('projects-hum-2.png'),
      img('projects-hum-3.png'),
      img('projects-hum-4.png'),
    ],
    projectLinkLabel: 'In Development',
    year: 'CDN Backend Architecture + Full-Stack Development + Design',
  },
  {
    id: 'project-3',
    title: 'Bitcoin Video Magazine',
    description:
      'Bitcoin Video Magazine is something new and TOTALLY DIFFERENT from anything which has ever lived in the Bitcoin media space, before. BVM will take you on a fun, educational, and inspirational journey around the world of Bitcoin and the Plebs #BUIDLing on it and supporting a Bitcoin Standard.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'CDN Content Development', 'Automation', 'CRON Jobs',
      'Solutions Engineering', 'Application Development',
      'NextJS', 'UGC Content', 'Print + Web Design',
      'Claude Code', 'Cloudflare Workers', 'TypeScript',
      'Cloudflare AI Workers', 'Tailwind CSS',
      'Cloudflare D1 + R2', 'Cloudflare Wrangler CLI',
    ],
    imageUrls: [
      img('projects-bvm-7.png'),
      img('projects-bvm-2.png'),
      img('projects-bvm-4.png'),
      img('projects-bvm-1.png'),
    ],
    //projectLinkLabel: 'In Development',
    projectUrl: 'https://bitcoinvideomagazine.com/',
    year: 'Head of Development',
  },
  {
    id: 'project-4',
    title: 'AI Product Try-On Generator',
    description:
      'An AI-powered virtual try-on tool that lets shoppers preview how a garment looks on a real person before buying. Upload a photo of a person and a flat product shot of a shirt, and the app generates a realistic preview of them wearing it — preserving pose, body shape, and lighting — in a few seconds.  Built entirely on the Cloudflare edge platform.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Application Development', 'TypeScript',
      'AI Image Generation', 'NextJS', 'Image Compression',
      'SAAS Development', 'Wrangler CLI',
      'Cloudflare Turnstile', 'GIT CI', 'Cloudflare Workers',
      'Claude Code', 'Cloudflare R2 Storage',
      'Cloudflare AI Workers', 'Cloudflare AI Gateway',
    ],
    imageUrls: [
      img('ai-gen-1.png'),
      img('ai-gen-2.png'),
      img('ai-gen-3.png'),
      img('ai-gen-4.png'),
    ],
    projectUrl: 'https://wor-virtual-try-on.sterlingbreck.workers.dev/',
    year: 'Product Development',
  },
  {
    id: 'project-5',
    title: 'Without Rulers Apparel',
    description:
      'Founded and built an independent direct-to-consumer and B2b apparel brand from concept through launch — identity system, e-commerce platform, payment integration, SEO, and editorial product photography. Designed an editorial storefront optimized for mobile checkout and responsive product storytelling, with a fully integrated print and digital brand system.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Cloudflare Workers', 'Brand Identity',
      'Payment Integrations', 'Art Direction',
      'AI Development', 'Product Development', 'Shopify',
      'E-Commerce + Fulfillment', 'Adobe Creative Cloud',
      'MidJourney', 'Custom Package Design', 'Kittl',
    ],
    imageUrls: [
      img('projects-wor-2.png'),
      img('projects-wor-7.png'),
      img('projects-wor-8.png'),
      img('projects-wor-6.png'),
    ],
    projectUrl: 'https://without-rulers.com',
    year: 'Founder',
  },
  {
    id: 'project-6',
    title: 'Bulk Product Image Creator',
    description:
      'Layer images together for templated, bulk or individual export of configurable product photos.  Client-side processing ensures privacy and instant results. Automatic compression, scaling, and centering of assets on upload with options for individual modification.  Multiple output formats with option for bulk grayscale export variation.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Application Development', 'CDN Content Development',
      'NextJS', 'Image Optimization', 'Claude Code',
      'Solutions Engineering', 'GIT CI', 'Image Compression',
      'Wrangler CLI', 'Cloudflare Workers', 'TypeScript',
    ],
    imageUrls: [
      img('projects-gen-4.png'),
      img('projects-gen-3.png'),
      img('projects-gen-2.png'),
      img('projects-gen-1.png'),
    ],
    projectUrl: 'https://product-image-maker.sterlingbreck.workers.dev/',
    year: 'Custom Productivity Tools',
  },
  {
    id: 'project-7',
    title: 'ADA Compliance Scanner',
    description:
      'Scans a single page against WCAG 2.1 Level AA — the technical standard adopted by the DOJs Title II web rule (28 CFR Part 35, Subpart H) — and produces a report written for developers, compliance staff and administrators at the same time, with detail on how to fix non-compliant content.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Application Development', 'NextJS', 'TypeScript',
      'Cloudflare Turnstile', 'Cloudflare D1', 'Tailwind CSS',
      'ADA/WCAG Accessibility Testing', 'Cloudflare Workers',
      'Rate Limiting', 'Hono', 'Cloudflare Wrangler CLI',
    ],
    imageUrls: [
      img('projects-ada-4.png'),
      img('projects-ada-3.png'),
      img('projects-ada-2.png'),
      img('projects-ada-1.png'),
    ],
    projectUrl: 'https://ada-title-ii-scanner.sterlingbreck.workers.dev/',
    year: 'Custom Auditing Tool',
  },
  {
    id: 'project-8',
    title: 'Rumble King',
    description:
      'Full brand identity refresh and digital presence for Rumble King, a popular Southern California band. Designed the wordmark, type system, and high-contrast visual language carried across web, print, and merchandise. Advisory for marketing, e-commerce and SASS integration, fulfillment, to support brand expansion.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Premium Apparel Rebrand', 'Typography',
      'Brand Identity', 'Adobe Creative Cloud', 'MidJourney',
      'Web Development', 'CMS Integration', 'Web Design',
      'Figma', 'Print Design', 'Ecommerce Fulfillment',
    ],
    imageUrls: [
      img('projects-rk-1.png'),
      img('projects-rk-2.png'),
      img('projects-rk-3.png'),
      img('projects-rk-4.png'),
    ],
    projectUrl: 'https://www.rumbleking.com',
    year: 'Designer + Consultant',
  },
  {
    id: 'project-9',
    title: 'Varnish Software',
    description:
      'Served as technical advisor for enterprise customers evaluating and implementing Varnish Cache. Consulted on caching architectures across bare metal and AWS VPC environments, optimizing cache hit ratios and reducing origin load by up to 85%. Built customer education programs translating complex caching concepts into actionable implementation plans, and contributed performance insights back to the product roadmap.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Varnish Cache Configuration', 'Bare METAL VPCS',
      'Web Performance', 'Edge Computing',
      'Caching Strategy', 'Technical Documentation',
      'Pre-Sales', 'Solutions Engineering', 'POST-Sales',
      'Customer Success', 'Caching Strategies',
    ],
    imageUrls: [
      img('projects-varnish-1.png'),
      img('projects-varnish-2.png'),
      img('projects-varnish-3.png'),
      img('projects-varnish-4.png'),
    ],
    projectUrl: 'https://www.varnish-software.com/',
    year: 'Solutions Engineer',
  },
  {
    id: 'project-10',
    title: 'Evrlink',
    description:
      'Managed cross-functional coordination between US design teams and offshore development for an MVP launch across mobile and desktop. Wrote UX specifications and product requirements, then built the frontend MVP including performance-optimized JavaScript animations and responsive design patterns. Established agile sprint planning frameworks and project management best practices',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Frontend Development', 'JavaScript',
      'Project Management', 'Wireframing', 'Agile / Scrum',
      'Responsive Design', 'Cross-Functional',
      'MVP Delivery', 'UX', 'Mobile + Desktop', 'Animation',
    ],
    imageUrls: [
      img('projects-evr-1.png'),
      img('projects-evr-2.png'),
      img('projects-evr-3.png'),
      img('projects-evr-4.png'),
    ],
    projectUrl: 'https://www.linkedin.com/in/sbreck/',
    year: 'Technical Project Manager + Senior Developer',
  },
  {
    id: 'project-11',
    title: 'Akamai',
    description:
      'Led post-sales implementation and ongoing customer success for West Coast financial services and e-commerce clients. Pioneered Akamai\'s first CLI-managed configurations for Fortune 500 banks, orchestrated zero-downtime infrastructure migrations across hybrid cloud environments, and ran IPv6 + HTTP/2 rollouts. Spearheaded the beta implementation of Bot Manager and tuned WAF rules for high-availability requirements.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Technical Project Management', 'Bot Management',
      'Akamai CDN', 'HTTP/2', 'IPv6', 'CDN Architecture',
      'Log Analysis', 'Financial Services', 'WAF Tuning',
      'Customer onboarding', 'DDOS MITIGATION',
      'E-commerce Sites', 'RUM', 'Performance Optimization',
      'Customer Success', 'Caching Strategies',
    ],
    imageUrls: [
      img('projects-akamai-1.png'),
      img('projects-akamai-2.png'),
      img('projects-akamai-3.png'),
      img('projects-akamai-4.png'),
    ],
    projectUrl: 'https://www.akamai.com/',
    year: 'Technical Project Manager II — Financial Services',
  },
  {
    id: 'project-12',
    title: 'Accenture',
    description:
      'Managed onshore/offshore frontend development teams of 8–12 engineers delivering CMS integration projects on Adobe Experience Manager, Hybris, and Demandware for enterprise clients. Led client-facing release reviews, coordinated deployment planning across complex environments, and implemented agile methodologies across cross-functional teams spanning PMO, UX, BI, and backend stakeholders.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Forward Deployed Development', 'Hybris',
      'Team Management', 'CMS Integrations', 'JavaScript',
      'Adobe Experience Manager', 'Demandware',
      'Frontend Development', 'Website Migrations',
      'Agile / Scrum', 'Enterprise Consulting', 'Mentorship',
    ],
    imageUrls: [
      img('projects-accenture-3.png'),
      img('projects-accenture-5.png'),
      img('projects-accenture-1.png'),
      img('projects-accenture-4.png'),
    ],
    projectUrl: 'https://www.accenture.com/',
    year: 'Manager, Frontend Development',
  },
  {
    id: 'project-13',
    title: 'Capital Group / American Funds',
    description:
      'Forward Deployed manager of frontend development team for large architecture and Adode Experience Manager Migration. Led client-facing release reviews, coordinated deployment planning across complex environments, and implemented agile methodologies across cross-functional teams spanning PMO, UX, BI, and backend stakeholders.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Adobe Experience Manager', 'Frontend Development',
      'Agile / Scrum', 'CMS Integration', 'Team Management',
      'Architecture', 'CI/CD Deployemnts', 'Adobe Suite',
      'A/B testing', 'analytics',
      'Forward Deployed Developer', 'QA',
    ],
    imageUrls: [
      img('projects-capgroup-1.png'),
      img('projects-capgroup-2.png'),
      img('projects-capgroup-3.png'),
      img('projects-capgroup-4.png'),
    ],
    projectUrl: 'https://www.capitalgroup.com/',
    year: 'Manager, Frontend Development',
  },
  {
    id: 'project-14',
    title: 'Nissan & Infiniti USA Websites',
    description:
      'Led maintenance, re-architecture, and weekly deployment cycles for nissanusa.com and infinitiusa.com — two of the highest-traffic automotive web properties in the US. Managed CI/CD planning and migrations across distributed on/offshore development resources and executed enterprise-scale Adobe Experience Manager migrations for both brands.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Adobe Experience Manager', 'CI/CD', 'JavaScript',
      'Frontend Development', 'Enterprise Migration',
      'animation', 'Automotive Marketing', 'Adobe Suite',
      'Team Management', 'Flash Development', 'SEO',
      'New Vehicle Microsites', 'QA',
    ],
    imageUrls: [
      img('projects-nissan-1.png'),
      img('projects-nissan-2.png'),
      img('projects-nissan-5.png'),
      img('projects-nissan-4.png'),
    ],
    projectUrl: 'https://www.nissanusa.com/',
    year: 'Manager, Frontend Development + Senior Developer',
  },
  {
    id: 'project-15',
    title: 'David Lynch',
    description:
      'Architected and developed web properties for filmmaker David Lynch, including interactive Flash experiences, an e-commerce storefront, and a subscription-based member platform that pioneered direct-to-fan content distribution. Managed DNS infrastructure and Apple Xserve web servers to keep media-rich content online for a global audience.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Flash Development', 'E-Commerce', 'Lead Developer',
      'Web-based games', 'DNS and Web Server maintenance',
      'Subscription Platform', 'Video Editing',
      'Member Portal', 'Production Art', 'Media Delivery',
      'Database Management',
    ],
    imageUrls: [
      img('projects-lynch-1.png'),
      img('projects-lynch-2.png'),
      img('projects-lynch-3.png'),
      img('projects-lynch-4.png'),
    ],
    projectLinkLabel: 'UNAVAILABLE',
    projectLinkVariant: 'unavailable',
    year: 'Lead Developer + Production Artist',
  },
  {
    id: 'project-16',
    title: 'Greg Gorman Photography',
    description:
      'Developed the portfolio site for celebrity photographer Greg Gorman — a quietly minimal showcase for decades of iconic black-and-white portraiture. Focused on large-format imagery, restrained typography, and a CMS workflow that let his studio update galleries without engineering involvement.',
    // Ordered so each row fills the tag column evenly at desktop width.
    tags: [
      'Web Design', 'Web Development', 'Photography',
      'CMS Integration', 'Portfolio',
      'Frontend Development', 'Editorial Design',
      'Studio Workflow', 'JavaScript', 'Responsive Design',
    ],
    imageUrls: [
      img('projects-gorman-1.png'),
      img('projects-gorman-2.png'),
      img('projects-gorman-3.png'),
      img('projects-gorman-4.png'),
    ],
    projectUrl: 'https://www.gormanphotography.com/',
    year: 'Senior Developer + Production',
  },
];
