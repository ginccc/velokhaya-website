import type { APIRoute } from 'astro';

// Every .astro page except the 404 is listed; adding a page adds it here automatically.
const pages = Object.keys(import.meta.glob('./**/*.astro'))
  .filter((file) => !file.endsWith('/404.astro'))
  .map((file) => file.replace(/^\.\//, '/').replace(/(index)?\.astro$/, '').replace(/([^/])$/, '$1/'))
  .sort();

export const GET: APIRoute = ({ site }) => {
  const urls = pages.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
