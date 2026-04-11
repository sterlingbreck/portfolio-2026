import type { Project } from '../types';

const imageModules = import.meta.glob('../assets/projects/*.png', {
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
    id: 'project-1',
    title: 'Bitcoin Video Magazine',
    description:
      'BVM is a centrifuge of Documentary, commentary, exploration and education; highlighting a diversity of subjects within the Bitcoin Space and the Plebeians',
    tags: ['Rebrand', 'CMS Integration', 'Print / Web', 'Content Automation', 'Framer', 'Web Development', 'Claude Code'],
    imageUrls: [
      img('projects-bvm-1.png'),
      img('projects-bvm-2.png'),
      img('projects-bvm-3.png'),
      img('projects-bvm-4.png'),
    ],
    projectUrl: 'https://www.bitcoinvideomagazine.com/',
    year: 'Head of Development',
  },
  {
    id: 'project-2',
    title: 'Without Rulers Apparel',
    description:
      'End-to-end design and development of a direct-to-consumer platform for an independent electronics brand. Focused on editorial product storytelling, seamless checkout flow, and responsive performance.',
    tags: ['Product Development', 'Print & Web Design', 'E-Commerce', 'SEO', 'Development', 'Payment Integration', 'Kittl', 'Photoshop', 'Illustrator', 'Midjourney', 'Claude Code'],
    imageUrls: [
      img('projects-wor-2.png'),
      img('projects-wor-6.png'),
      img('projects-wor-4.png'),
      img('projects-wor-5.png'),
    ],
    projectUrl: 'https://without-rulers.com',
    year: 'Founder',
  },
  {
    id: 'project-3',
    title: 'Rumble King',
    description:
      'A monospaced typeface designed for creative coding environments. Five weights, full Latin character set, ligature support, and optimized for on-screen legibility at small sizes.',
    tags: ['Typography', 'Type Design'],
    imageUrls: [
      img('projects-rk-1.png'),
      img('projects-rk-2.png'),
      img('projects-rk-3.png'),
      img('projects-rk-4.png'),
    ],
    projectUrl: 'https://www.rumbleking.com',
    year: 'Rebrand',
  },
  {
    id: 'project-4',
    title: 'Varnish Software',
    description:
      'A monospaced typeface designed for creative coding environments. Five weights, full Latin character set, ligature support, and optimized for on-screen legibility at small sizes.',
    tags: ['Typography', 'Type Design'],
    imageUrls: [
      img('projects-varnish-1.png'),
      img('projects-varnish-2.png'),
      img('projects-varnish-3.png'),
      img('projects-varnish-4.png'),
    ],
    projectUrl: 'https://www.varnish-software.com/',
    year: 'Rebrand',
  },
  {
    id: 'project-5',
    title: 'Evrlink',
    description:
      'A minimal portfolio site for an award-winning architecture studio. Large-format imagery, horizontal scroll galleries, and a restrained typographic system that lets the work speak for itself.',
    tags: ['Web Design', 'Portfolio', 'Architecture'],
    imageUrls: [
      img('projects-evr-1.png'),
      img('projects-evr-2.png'),
      img('projects-evr-3.png'),
      img('projects-evr-4.png'),
    ],
    projectUrl: 'https://www.linkedin.com/in/sbreck/',
    year: 'Project Manager + Developer',
  },
  {
    id: 'project-6',
    title: 'Akamai',
    description:
      'Sustainable packaging design for a natural skincare line. Mono-material construction, soy-based inks, and a modular label system that scales across 40+ SKUs while maintaining visual cohesion.',
    tags: ['Packaging', 'Sustainability', 'Print'],
    imageUrls: [
      img('projects-akamai-1.png'),
      img('projects-akamai-2.png'),
      img('projects-akamai-3.png'),
      img('projects-akamai-4.png'),
    ],
    projectUrl: 'https://www.averydennison.com/',
    year: 'Technical Project Manager',
  },
    {
    id: 'project-7',
    title: 'Accenture',
    description:
      'Sustainable packaging design for a natural skincare line. Mono-material construction, soy-based inks, and a modular label system that scales across 40+ SKUs while maintaining visual cohesion.',
    tags: ['Packaging', 'Sustainability', 'Print'],
    imageUrls: [
      img('projects-accenture-3.png'),
      img('projects-accenture-2.png'),
      img('projects-accenture-1.png'),
      img('projects-accenture-4.png'),
    ],
    projectUrl: 'https://www.accenture.com/',
    year: 'Sr Developer',
  },
  {
    id: 'project-8',
    title: 'Nissan & Infiniti USA Websites',
    description:
      'Sustainable packaging design for a natural skincare line. Mono-material construction, soy-based inks, and a modular label system that scales across 40+ SKUs while maintaining visual cohesion.',
    tags: ['Packaging', 'Sustainability', 'Print'],
    imageUrls: [
      img('projects-nissan-1.png'),
      img('projects-nissan-2.png'),
      img('projects-nissan-5.png'),
      img('projects-nissan-4.png'),
    ],
    projectUrl: 'https://www.nissanusa.com/',
    year: 'Manager Frontend Development + Sr Developer',
  },
  {
    id: 'project-9',
    title: 'David Lynch',
    description:
      'Sustainable packaging design for a natural skincare line. Mono-material construction, soy-based inks, and a modular label system that scales across 40+ SKUs while maintaining visual cohesion.',
    tags: ['Packaging', 'Sustainability', 'Print'],
    imageUrls: [
      img('projects-lynch-1.png'),
      img('projects-lynch-2.png'),
      img('projects-lynch-3.png'),
      img('projects-lynch-4.png'),
    ],
    projectUrl: 'https://www.linkedin.com/in/sbreck/',
    year: 'Sr Developer + Production',
  },
  {
    id: 'project-10',
    title: 'Greg Gorman Photography',
    description:
      'Sustainable packaging design for a natural skincare line. Mono-material construction, soy-based inks, and a modular label system that scales across 40+ SKUs while maintaining visual cohesion.',
    tags: ['Packaging', 'Sustainability', 'Print'],
    imageUrls: [
      img('projects-gorman-1.png'),
      img('projects-gorman-2.png'),
      img('projects-gorman-3.png'),
      img('projects-gorman-4.png'),
    ],
    projectUrl: 'https://www.gormanphotography.com/',
    year: 'Sr Developer + Production',
  },
];