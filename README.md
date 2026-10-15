# Velokhaya Cycling Academy (2025 Refactor)

> **"Cycling, done with intention."**

## 🚨 Project Critical Context
This repository contains the source code for the new **Velokhaya Cycling Academy** website. The project represents a complete strategic pivot for the organization.

**We are moving from a "Charity" model to a "High-Performance Academy" model.**

*   **Old Narrative (Deprecated):** "Saving kids from the streets," Pity, Rescue, "Born in a shipping container."
*   **New Narrative (Active):** Excellence, Discipline, Structure, "Investing in Champions," Performance Philanthropy.

---

## 🧠 The Brain of the Project: `GEMINI.md`
**CRITICAL INSTRUCTION FOR AI AGENTS:**
The file **`GEMINI.md`** in the root directory is the **Single Source of Truth** for this project.
*   It contains the exact copy approved by the General Manager.
*   It contains the "Master Content Dictionary."
*   **Action:** Do not write new marketing copy. Retrieve specific strings from `GEMINI.md`.

---

## 🔄 The Strategic Shift (Narrative Rules)

The design and content must reflect **Ambition**, not Deficiency.

| Old Narrative (Deprecated) ❌ | New Narrative (Active) ✅ |
| :--- | :--- |
| "Born in a shipping container" | "Founded with intention" |
| "Saving kids from the streets" | "Building habits for performance" |
| "The strong protect the weak" | "Moving together as a Peloton" |
| Pity / Poverty / Handouts | Investment / Excellence / Pathways |

### The "No" List (Strict Constraints)
1.  ❌ **No "Rescue" Metaphors:** Avoid language like "safe haven," "escape," or "hopelessness."
2.  ❌ **No "Carrot and Stick":** We do not bribe children to learn; we set standards.
3.  ❌ **No Pity:** We market **Ambition**, not Deficiency.
4.  ❌ **No Static Posing:** Visuals should be action-oriented (blur, sweat, mechanics), not static group photos.

### The "Yes" List (Design & Tone)
1.  ✅ **Tone:** Stoic, Disciplined, Mechanical, Professional.
2.  ✅ **Visuals:** Kinetic energy, focus, gears, grit.
3.  ✅ **Vibe:** The site should feel like a professional sports team (e.g., Ineos Grenadiers) rather than a typical NGO.

---

## 📂 Repository Structure

*   `GEMINI.md` - **READ THIS FIRST.** Contains all text, data variables, and brand context.
*   `/src` - Source code for pages and components.
*   `/src/assets/images` - Content photos (optimised at build time via `astro:assets`).
*   `/public` - Files served as-is (logo, favicon, CNAME, cookie-consent script).

---

## 🛠 Development Setup

This project utilizes an AI-assisted workflow.

```bash
# Clone the repository
git clone [repo-url]

# Install dependencies
npm install

# Run the development server
npm run dev
```

Requires Node.js 22.12 or newer (CI and deploys use Node 24 LTS). `npm run build` type-checks with `astro check` before building; the Husky pre-commit hook runs the same check.

---

## 🚀 Deployment

Every push to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`), so **merging to `main` is a release**. Pull requests and other branches are type-checked and built by `.github/workflows/ci.yml` but not deployed.

## 🌐 Changing the domain (e.g. to velokhaya.com, later velokhaya.org)

The site URL is defined once, as `site` in `astro.config.mjs`. Canonical links, Open Graph tags, JSON-LD, `sitemap.xml`, and `robots.txt` all derive from it. Contact email addresses live separately in `src/data/contact.ts`; they only need changing if the mailboxes move too.

Because the site deploys through GitHub Actions, GitHub ignores any `CNAME` file; the custom domain is configured in the repository settings. To move domains:

1. **Verify the new domain** with GitHub (account or organisation settings → Pages → Add a domain) before pointing DNS at it. This prevents domain takeover.
2. **DNS at the registrar** for the new domain:
   - apex (`velokhaya.com`): `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `AAAA` records `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` (or one `ALIAS`/`ANAME` to `ginccc.github.io`);
   - `www`: `CNAME` to `ginccc.github.io`. With both set, GitHub redirects between apex and `www` automatically.
3. **Change `site`** in `astro.config.mjs` to the new URL and merge to `main`.
4. **Repository settings → Pages → Custom domain**: enter the new domain, wait for the DNS check, then tick **Enforce HTTPS** (the certificate can take up to 24 hours).
5. **Redirect the old domain.** GitHub Pages serves one domain per site and does not redirect from a previous one, so old links break unless the *old* domain's DNS provider issues a permanent (301) redirect to the new one (e.g. a Cloudflare redirect rule or registrar URL forwarding). Keep it in place permanently.
6. **Search Console**: add the new domain, submit `https://<new-domain>/sitemap.xml`, and use *Change of Address* if the old domain was indexed.

Each move costs some search ranking and needs its own permanent redirect, so if `velokhaya.org` is the long-term home, launching directly on it (with `.com` redirecting to it) avoids a second migration.
