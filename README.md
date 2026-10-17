# Velokhaya Life Cycling Academy — Website

> **Cycling, done with intention.**

The public website of [Velokhaya Life Cycling Academy](https://velokhaya.com), a cycling academy in Khayelitsha, Cape Town, that develops young athletes through three integrated pillars: cycling, education, and nutrition.

It is a static site built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed to GitHub Pages.

**Working on this repo with an AI agent?** Point it at [`AGENTS.md`](AGENTS.md). It holds every rule, convention, and check the agent needs.

---

## The brand in one paragraph

The site presents Velokhaya as a **high-performance academy, not a charity**. It should feel like a professional sports team (think Ineos Grenadiers or Rapha) that happens to have a social mission. The tone is stoic, disciplined, and professional, and the site markets **ambition, not deficiency**. That means no rescue metaphors, no pity, and no "saving kids from the streets".

The approved copy and the full brand rules live in [`GEMINI.md`](GEMINI.md). Don't write new marketing copy; use the strings there.

---

## Quick start

Requires **Node.js 22.12+** (CI and deploys use Node 24 LTS).

```bash
npm install        # also installs the Husky pre-commit hook
npm run dev        # dev server at http://localhost:4321
```

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Local dev server with hot reload |
| `npm run check` | Type-checks all `.astro` and `.ts` files (`astro check`) |
| `npm run build` | Type-checks, then builds the static site into `dist/` |
| `npm run preview` | Serves the built `dist/` (run `build` first) |

`npm run build` fails on any type error, warning, or hint. The pre-commit hook runs the same check.

---

## Pages

| Page | Path | Notes |
| :--- | :--- | :--- |
| Home | `/` | Hero, "Moving Together", partners, testimonial, FAQ |
| Our Approach | `/our-approach/` | Origin story, timeline, leadership, hall of fame |
| Impact | `/impact/` | The three pillars, road-safety advocacy, impact stats |
| Support | `/support/` | Donations and corporate partnerships, both via the contact form |
| Contact | `/contact/` | Address, hours, contact details, contact form |
| Privacy Policy | `/privacy-policy/` | POPIA-oriented draft, **not yet legally reviewed** |
| Terms of Use | `/terms-of-use/` | Draft, **not yet legally reviewed** |
| 404 | any unknown URL | Not indexed by search engines |

`sitemap.xml` and `robots.txt` are generated at build time.

---

## How the site works

- **Contact form.** The site has no backend. The form opens the visitor's email app with the message pre-filled, addressed to the address in `src/data/contact.ts`. Messages are capped at 1,000 characters so the `mailto:` link stays within the limits of Windows mail clients. Links like `/contact/?topic=donation` preselect the subject.
- **Donations.** There is **no online payment method**. The Yoco link was removed after it started returning 404, and bank details are deliberately not published. "Make a Donation" opens the contact form.
- **Analytics.** Amplitude (EU servers) loads **only after the visitor consents** in the cookie banner. Withdrawing consent stops it immediately and deletes its cookies. Session replay is not installed.
- **No third parties at page load.** Fonts and icons are self-hosted, and photos are optimised at build time. A page makes no requests to other servers until a visitor accepts analytics.

---

## Project structure

```text
src/
  pages/            One file per route, plus robots.txt.ts and sitemap.xml.ts
  layouts/          BaseLayout.astro: <head>, SEO/OG tags, header, footer, consent script
  components/       Header, Footer, and brand icons Lucide no longer ships
  scripts/          cookie-consent.ts: consent banner and the lazy analytics loader
  data/contact.ts   Public email addresses (single source)
  assets/images/    Content photos, optimised at build time
  styles/           Tailwind theme (global.css) and cookie-banner styles
public/             Served as-is: favicon and the logo (needs a fixed URL)
scripts/            generate-og-image.mjs: the default social-preview image (npm run og-image)
GEMINI.md           Brand rules and the approved copy dictionary
AGENTS.md           Instructions for AI agents working on this repo
```

---

## Deployment

Every push to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`). **Merging to `main` is a release.**

Pull requests and other branches are type-checked and built by `.github/workflows/ci.yml`, but not deployed. Work on a branch, open a pull request, and merge once CI is green.

---

## Changing the domain

The site lives at `velokhaya.com` (it was previewed at `velokhaya.labs.ai` before launch). It may later move to `velokhaya.org`.

The site URL is defined once, as `site` in `astro.config.mjs`. Canonical links, Open Graph tags, JSON-LD, `sitemap.xml`, and `robots.txt` all derive from it. Contact email addresses live separately in `src/data/contact.ts`; they only need changing if the mailboxes move too.

The site deploys through GitHub Actions, so GitHub ignores any `CNAME` file. The custom domain is set in the repository settings. To move domains:

1. **Verify the new domain** with GitHub (account or organisation settings → Pages → Add a domain) before pointing DNS at it. This prevents domain takeover.
2. **Add DNS records** at the registrar for the new domain:
   - apex (`velokhaya.com`): `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `AAAA` records `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` (or one `ALIAS`/`ANAME` record pointing to `ginccc.github.io`);
   - `www`: a `CNAME` to `ginccc.github.io`. With both set, GitHub redirects between the apex and `www` automatically.
3. **Change `site`** in `astro.config.mjs` to the new URL and merge to `main`.
4. **In repository settings → Pages → Custom domain**, enter the new domain and wait for the DNS check. Then tick **Enforce HTTPS** (the certificate can take up to 24 hours).
5. **Redirect the old domain.** GitHub Pages serves one domain per site and doesn't redirect from a previous one. Old links break unless the *old* domain's DNS provider issues a permanent (301) redirect to the new one, for example a Cloudflare redirect rule or registrar URL forwarding. Keep it in place permanently.
6. **Update Search Console:** add the new domain, submit `https://<new-domain>/sitemap.xml`, and use *Change of Address* if the old domain was indexed.

Each move costs some search ranking and needs its own permanent redirect. If `velokhaya.org` is the long-term home, launching directly on it (with `.com` redirecting to it) avoids a second migration.

---

## Open items (need the organisation, not code)

- Decide on an online donation method; until then, donations go through the contact form.
- Legal review of the privacy policy and terms, and name the POPIA Information Officer.
- Add NPO/PBO registration numbers to the footer badges, or remove the badges.
- Verify the phone number, opening hours, partner list, and testimonial.
