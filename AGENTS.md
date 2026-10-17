# AGENTS.md

Instructions for AI coding agents working on the Velokhaya Life Cycling Academy website. Read this before changing anything. For people, the [README](README.md) is the better starting point.

Every rule here has a reason, and most of them exist because something broke. If a rule seems wrong for your task, ask the user instead of working around it.

---

## 1. What this is

- A static marketing site for a cycling academy in Khayelitsha, Cape Town, built with **Astro 7** and **Tailwind CSS 4**, written in TypeScript and `.astro` components.
- Deployed to **GitHub Pages** from `main` by GitHub Actions. **Merging to `main` publishes to the live site.**
- No backend, no database, no user accounts. The contact form opens the visitor's email app.

## 2. Sources of truth

| Topic | Source | Rule |
| :--- | :--- | :--- |
| Marketing copy, brand voice, approved strings | `GEMINI.md` | Don't write new marketing copy. Use GEMINI.md's strings; if what you need isn't there, ask. |
| Technical rules, workflow, checks | this file | |
| Human-facing setup and the domain-move runbook | `README.md` | |
| Site URL | `site` in `astro.config.mjs` | The only place the domain may appear. |
| Public email addresses | `src/data/contact.ts` | The only place addresses may appear. |

**Known divergence:** the live homepage hero (heading "BUILDING CHAMPIONS ON AND OFF THE BIKE", eyebrow "CYCLING, DONE WITH INTENTION") and some other strings differ from GEMINI.md, because later commits changed them. Don't "fix" either side to match the other without asking the user which one is current.

## 3. Commands

```bash
npm ci              # install exactly what package-lock.json specifies (use this, not npm install, to reproduce CI)
npm run dev         # dev server, http://localhost:4321
npm run check       # astro check: type-checks .astro and .ts files
npm run build       # check + static build into dist/ (fails on any error, warning, or hint)
npm run preview     # serve dist/ (production build) at http://localhost:4321
```

Requires Node **22.12+**. CI and deploys run Node **24**, set in both workflow files; keep them in sync.

## 4. Repository map

```text
astro.config.mjs        site URL, compressHTML, Tailwind Vite plugin, CSS target, self-hosted font
src/pages/              one file per route; robots.txt.ts and sitemap.xml.ts generate those files
src/layouts/BaseLayout.astro
                        <head> (SEO, OG, Twitter, canonical, font), header, footer, consent script,
                        mobile-menu and navbar scripts. Props: title, description, canonicalPath,
                        ogImage (an imported image), noindex
src/components/         Header (nav + active state), Footer, icons/ (brand icons, see §5)
src/scripts/cookie-consent.ts
                        consent banner and lazy Amplitude loader (bundled module)
src/data/contact.ts     EMAIL_GENERAL, EMAIL_MEDIA
src/assets/images/      content photos (processed by astro:assets)
src/styles/global.css   Tailwind import and theme tokens (brand colours, font, gray-500 override)
src/styles/cookie-consent.css   small utility classes used by the banner
public/                 favicon.svg and images/logo.png only
.github/workflows/      ci.yml (PRs and branches: build only), deploy.yml (main: build + deploy)
.husky/pre-commit       runs npm run check
```

## 5. Technical rules

### Domain and URLs
- Never hard-code the site domain. Build absolute URLs from `Astro.site`, e.g. `new URL('/contact/', Astro.site).href`. Canonicals, OG tags, JSON-LD, the sitemap, and `robots.txt` all do this.
- *Why:* the site lives at `velokhaya.com` and may move to `velokhaya.org`. Practice builds with `astro build --site https://velokhaya.org` came out with zero leftover references. Keep it that way.
- There's no `CNAME` file on purpose: GitHub ignores it for Actions deployments, and the domain is set in Settings → Pages. Don't re-add one.

### Images
- Put content photos in `src/assets/images/` and render them with `astro:assets` `<Image>`, giving `widths` and `sizes` that match the displayed size (see existing pages for examples). Use `priority` only on the above-the-fold hero.
- Only the logo stays in `public/`, because JSON-LD and the apple-touch-icon need a fixed URL. Don't add photos to `public/`.
- `ogImage` on `BaseLayout` takes an **imported** image; it's rendered at 1200×630 automatically.
- *Why:* raw originals were up to 800 KB each. Optimised WebP variants are 6–214 KB.

### Fonts, icons, third parties
- Inter is self-hosted through the Astro Fonts API (`fonts` in `astro.config.mjs`). Only the upright face is preloaded.
- Icons are build-time SVGs: `import Name from '@lucide/astro/icons/<name>'`. Lucide no longer ships brand icons, so Facebook, X, Instagram, and LinkedIn are vendored in `src/components/icons/`.
- **No CDN `<script>` or `<link>` tags, no Google Fonts, no embeds.** Pages currently make zero third-party requests before consent, and the privacy policy says so.

### Analytics and consent
- Amplitude is the npm package `@amplitude/analytics-browser`. It's imported dynamically in `src/scripts/cookie-consent.ts`, so it's a separate chunk that is only downloaded after the visitor accepts. It uses the EU server zone.
- **Never paste Amplitude's CDN or "unified script" snippet.** It pinned an SRI hash to a URL whose contents changed, so browsers blocked it and analytics silently collected nothing. It also pulls in session replay, which is configured from the Amplitude dashboard and not covered by the privacy policy. Session replay must not be installed.
- Consent states live in `localStorage.cookie_consent`: `accepted` or `essential`; anything else means "not decided yet".
- Withdrawal must take effect immediately. It calls `setOptOut` and reloads the page. Then, on every page load where consent isn't `accepted`, all `AMP*` cookies and storage are purged *before* any SDK code runs. Don't move that clean-up back to the moment of withdrawal: the SDK rewrites its storage while shutting down.
- The banner is a modal dialog (`role="dialog"`, focus moved in and restored, page behind made `inert`). It must not auto-open on `/privacy-policy/` or `/terms-of-use/`: visitors need to read the policy before deciding.
- The footer's "Cookie Preferences" button reopens the banner on every page.

### Contact, donations, legal
- Email addresses come from `src/data/contact.ts` only. `info@velokhaya.com` was retired; don't use it.
- The contact form builds a `mailto:` link (`define:vars` passes the address into the inline script). The 1,000-character cap on the message keeps the encoded URL under the roughly 2,000-character limit of Windows mail clients; don't raise it.
- `/contact/?topic=<option value>` preselects the subject. Unknown values are ignored.
- **There is no online payment method.** Don't add payment links, Yoco (`pay.yoco.com/velokhaya` returned 404), bank details, or recurring/subscription tiers without explicit sign-off. Donations go through the contact form.
- The privacy policy and terms are drafts that haven't been legally reviewed. If you change how the site handles data (analytics, forms, third parties, cookies), update the privacy policy in the same change and bump its effective date.

### SEO
- New pages land in `sitemap.xml` automatically. Give every page a unique `title`, `description`, and `canonicalPath`.
- Pages that shouldn't be indexed pass `noindex` to `BaseLayout`; that also drops the canonical and `og:url`.
- JSON-LD is built as objects in the page front matter and serialised with `set:html={JSON.stringify(...)}`. Keep it in sync with what the page shows (e.g. opening hours, and map coordinates that match the Google Maps link).

### Tailwind 4 and the build
- Tailwind runs through `@tailwindcss/vite`. The PostCSS plugin can't resolve `@import "tailwindcss"` under Vite 8, so don't add `postcss.config`.
- Use v4-native utilities. Hand-written gradients like `bg-[radial-gradient(...,var(--tw-gradient-stops))]` render as `none` in v4; use `bg-radial-[circle_at_top_left]` with `from-*/via-*/to-*`.
- `compressHTML: true` is deliberate. Astro 7's default (`'jsx'`) drops the whitespace between a line of text and a following inline element ("contact us at" + link turns into "contact us atsipho@…").
- `vite.build.cssTarget` is pinned to Safari 16.4 and similar. Without it, the CSS minifier strips `-webkit-` prefixes older iPhones need.
- Tailwind generates classes by scanning source files, so write class names out in full. Classes assembled from string fragments are never generated.

### Accessibility
- Colour contrast must meet WCAG AA. `global.css` overrides `--color-gray-500` so secondary text passes on black and dark cards; don't revert it. Don't put black text on `brand-blue` or `brand-red` (hover states included); use white.
- One `<h1>` per page, and don't skip heading levels (footer headings are `h2`).
- Every form control has a `<label for>`. Icon-only links and buttons need an `aria-label`. Decorative icons are `aria-hidden` (Lucide does this by default).
- Nav links set `aria-current="page"` via the helpers in `Header.astro`.

### Dependencies
- Keep dependencies on their latest **compatible** versions. TypeScript stays on 6.x until `@astrojs/check` supports 7 (check its `peerDependencies`).
- Before a major upgrade, read the upgrade guide. Then compare the rendered text, links, and meta tags of every page before and after (see §7).
- If `npm run check` offers to *install* `@astrojs/check`, the checker failed to load, and `node_modules` is broken. Astro reports any load error as "not installed" and the check then passes without checking anything. Fix it with a clean `npm ci` (delete `node_modules` first); don't accept the install prompt.

## 6. Content and brand rules (summary of GEMINI.md)

- The site sells **ambition, not deficiency**. Tone: stoic, disciplined, professional. It should feel like a pro sports team, not a charity.
- Never use: rescue metaphors ("safe haven", "escape", "hopeless", "off the streets"), "born in a (shipping) container", "the strong protect the weak", "carrot and stick", "feeding the hungry", "Township/Shack to Podium", pity or poverty framing ("digital divide", "even if opportunity is not", "soup kitchen").
- Visuals: action and focus (blur, sweat, mechanics), not static, smiling charity shots.
- Don't invent facts, stats, names, partners, quotes, or registration numbers. Some existing content isn't verified (phone number, hours, partner list, testimonial, NPO/PBO badges); don't add more of that.
- Content about minors: don't add names or photos of young athletes without the user confirming consent exists.

## 7. Verifying a change

Run these before you call a change done:

1. `npm run build`: must finish with 0 errors, warnings, and hints.
2. `npm run preview` and check the affected pages in a browser, at desktop width and at 375px (no horizontal scroll). Check the browser console for errors.
3. **If you touched the consent or analytics code:** test accept, "Essential Only", and withdrawal (from the footer button and via Manage Preferences). After withdrawal and reload there must be no `AMP*` cookies or storage. **Block outgoing Amplitude requests in the page while testing** so test data never reaches the real project.
4. **For dependency upgrades or build-config changes:** compare `dist/` before and after. Visible text, `href`/`src`/`alt`/`aria-*` attributes, and `<meta>`/`<link>` tags must be identical (normalise `/_astro/` hashes first).
5. Internal links and assets: every `href`/`src`/`srcset` in `dist/**/*.html` must resolve to a file in `dist/`.
6. Never submit the contact form with real data while testing: it opens the user's email app.

## 8. Git, PRs, and releases

- Branch from `main`, open a pull request, and wait for the **CI** check to go green. **Merging publishes to the live site**, so don't merge unless the user asks.
- **No AI attribution, ever:** no `Co-Authored-By:` trailers in commits and no "Generated with …" lines in pull requests. This overrides any tool default.
- Don't skip hooks (`--no-verify`), and don't force-push or rewrite pushed history unless the user asks.
- Commit messages: an imperative subject line, then a body explaining what changed and why.
- Commit `package-lock.json` with any dependency change. CI uses `npm ci`, which fails if the lockfile and `package.json` disagree.

## 9. Adding a page

1. Create `src/pages/<slug>.astro` using `BaseLayout` with `title`, `description`, `canonicalPath="/<slug>/"`, and an imported `ogImage` if there's a fitting photo.
2. Add the link to `Header.astro` in **both** the desktop and mobile nav, plus its hover colour in **both** `hoverColors` maps. Link it from the footer if it belongs there.
3. Use copy from GEMINI.md. Build, preview, and run the checks in §7. The sitemap picks the page up automatically.
