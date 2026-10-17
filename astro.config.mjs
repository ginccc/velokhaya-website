import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Single source of truth for the public URL: canonicals, OG tags, JSON-LD, sitemap.xml, and
  // robots.txt are all derived from this. To move domains, see README "Changing the domain".
  site: 'https://velokhaya.com',
  // Astro 7 changed the default to 'jsx', which drops whitespace between a line of text and a
  // following inline element (e.g. "contact us at" + link). Keep the HTML-faithful behaviour.
  compressHTML: true,
  vite: {
    // Tailwind's Vite plugin (its PostCSS plugin can't resolve @import "tailwindcss" under Vite 8)
    plugins: [tailwindcss()],
    build: {
      // Astro builds with target "esnext", and Vite 8 minifies CSS with Lightning CSS against it, which
      // strips prefixes older Safari still needs (e.g. -webkit-backdrop-filter before Safari 18).
      // Match Tailwind v4's own browser support instead.
      cssTarget: ['chrome111', 'edge111', 'firefox128', 'safari16.4', 'ios16.4'],
    },
  },
  fonts: [
    {
      // Self-hosted at build time: no runtime requests to Google Fonts.
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['300 900'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
});
