# Sterling Portfolio

A single-page portfolio website built with React, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS v4** with custom `@theme` tokens
- **Lucide React** for UI icons

## Features

### Full-Screen Image Gallery
- Auto-advancing slideshow with 5-second intervals and smooth transitions
- Seamless infinite loop — the first slide follows the last without rewinding
- Vignette overlay that fades to black on inner edges for depth
- Dot indicators showing the current slide, clickable to jump to any image
- Images auto-discovered from `src/assets/gallery/` via Vite's `import.meta.glob`

### Project Tiles
- Full-width cards with rounded corners and soft shadow styling
- Alternating image/text layout on desktop for visual rhythm
- Responsive stacking — horizontal on desktop, vertical on mobile
- Each tile includes project title, description, tags, year, and an external link

### Greyscale Design System
- Black and white theme defined with Tailwind v4 `@theme` custom properties
- Typography pairing: Instrument Serif (display) + DM Sans (body)
- Consistent color tokens: `bg`, `text`, `text-muted`, `text-subtle`, `border`, `accent`

### Responsive Layout
- Mobile-first design with breakpoints at `sm`, `md`, `lg`, `xl`, and `2xl`
- Fluid spacing and gallery height using `clamp()` for smooth scaling
- Gallery bleeds edge-to-edge across all screen sizes
- Project content contained within a `max-w-6xl` wrapper

### Footer
- "Let's work together" CTA section
- Email contact link
- Social icons (GitHub, LinkedIn, Instagram)
- Copyright bar

## Getting Started

```bash
npm install
npm run dev
```

## Adding Content

### Gallery Images
Drop images (jpg, png, webp, avif) into `src/assets/gallery/`. They are automatically discovered and displayed in alphabetical order.

### Projects
Edit `src/data/projects.ts` to update project titles, descriptions, tags, images, and links.

### Favicon
The favicon set (browser tabs, iOS Add-to-Home-Screen, Android Chrome, PWA) is generated from a single source PNG via a one-shot script.

To swap in a new favicon image:

1. Replace `scripts/source-favicon.png` with your new image. Requirements:
   - **Square** (the script will reject non-square images)
   - **At least 512×512** — 1024×1024 ideal
   - **Transparent background** preferred
   - **~10% padding** around the logo so Android's circle/squircle crop doesn't clip it
2. Run the generator:
   ```bash
   npm run favicons
   ```
   This writes `favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png`, and the two `web-app-manifest-*.png` files into `public/`.
3. Commit the updated `scripts/source-favicon.png` and the regenerated files in `public/`, then push. Cloudflare will redeploy in 1–2 min.
4. **Hard-refresh** (Cmd+Shift+R) the live site to bust browser cache. For iOS Add-to-Home-Screen testing, delete the existing home screen tile first — iOS aggressively caches it.

## Project Structure

```
src/
  components/
    Header.tsx          — Minimal top navigation
    Gallery.tsx         — Auto-scrolling full-bleed slideshow
    ProjectTile.tsx     — Individual project card
    ProjectsSection.tsx — Stacked project tile list
    Footer.tsx          — Contact info and social links
  assets/
    gallery/            — Gallery source images
  data/
    projects.ts         — Project content data
  types/
    index.ts            — TypeScript interfaces
  App.tsx               — Root layout
  index.css             — Tailwind theme and base styles
```
