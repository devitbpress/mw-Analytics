# BRIEF: Meditya Wasesa Analytics website

This file is the permanent context for the whole project. Read it fully before every task. Work is done in stages (see `PROMPTS.md`). Only touch what the current stage asks for.

---

## 1. Project summary

A professional, light-mode portfolio and consulting website for **Meditya Wasesa Analytics**, a data analysis and simulation consultancy founded by Dr. Meditya Wasesa (PhD, Germany; lecturer at Institut Teknologi Bandung).

- **Primary goal now:** let visitors browse completed work and verify it through live, clickable evidence (websites, interactive simulations).
- **Eventual goal:** visitors contact the company for consulting. Keep the call to action visible but soft.
- **Language:** English only.
- **Domain:** `ganeca10.id` (root is empty; existing subdomains such as `mangrove-analytics.ganeca10.id` and `discover-pengudang.ganeca10.id` must never be affected).
- **Analytics:** self-hosted Umami at `stats.ganeca10.id` (PostgreSQL).

### Naming rules
- In the logo: **MW Analytics**.
- Everywhere in website text, page titles, footer, meta tags and copyright: **Meditya Wasesa Analytics** (full name, never abbreviated).
- Copyright line: `© 2026 Meditya Wasesa Analytics`.

---

## 2. Audience

Corporate and state-owned industrial clients, university research institutes, and government or academic collaborators. They are decision makers and technical managers: they want credibility, evidence, and clarity, not hype.

Tone: precise, calm, confident, plain English. No buzzword stacking, no exaggerated claims, no fake statistics.

---

## 3. Positioning and copy (draft, replace later)

**One-line positioning:** Data analysis, simulation, and machine learning for evidence-based decisions.

**Hero headline (draft):** Turning complex data into decisions you can verify.
**Hero subline (draft):** We build analyses, simulation models, and interactive tools, and deliver them as research, working software, and clear recommendations.

**Vision (draft):** To be a trusted research-driven partner that makes complex systems understandable and decisions measurable.

**Mission (draft):**
1. Apply rigorous analysis and simulation to real operational and environmental problems.
2. Deliver results that can be inspected: working web tools, reproducible models, and peer-reviewed publications.
3. Bridge academic research and practical use through collaboration with industry and public institutions.

### Services (draft, 6 cards)
1. **Data analysis and analytics:** exploratory, statistical, and diagnostic analysis for operational and strategic questions.
2. **Simulation modeling:** agent-based, discrete-event, and system dynamics models (for example with AnyLogic) to test scenarios before committing resources.
3. **Machine learning and predictive modeling:** forecasting, classification, and optimization with validated, explainable methods.
4. **Geospatial and environmental analytics:** spatial analysis and carbon or ecosystem estimation from field and remote-sensing data.
5. **Interactive decision-support tools:** web apps and dashboards that let stakeholders explore results themselves.
6. **Research and publication partnership:** joint studies that result in peer-reviewed papers and technical reports.

---

## 4. Design system

### Direction
Professional consulting, clean, light mode only for now. Reference sites and what to take from each:

| Element | Reference | Take |
|---|---|---|
| Overall professional feel | https://www.strong.io/solutions | Credible layout rhythm, section structure, restrained styling |
| Navigation bar | https://www.beyondkey.com/blog/best-data-analytics-consulting-companies/ | Navbar style only |
| Home banner (hero) | https://www.theseattledataguy.com/ | Hero composition |
| Project cards | https://unicage.eu/ | Card grid for completed projects |
| Insights article style | https://lilianweng.github.io/posts/2026-07-04-harness/ and https://distill.pub/2021/understanding-gnns/ | Narrow readable column, table of contents, figures with captions, math, code |
| Not to adopt | https://daqconsulting.com/ | Do not imitate |

Do not copy any reference's text, images, or code. Take layout ideas only.

### Colors (from the logo)
| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#063499` | Headings accents, buttons, links, logo |
| `--color-accent` | `#26CCFF` | Highlights, icons, hover, chart accents. Do not use as text on white (low contrast) |
| `--color-primary-dark` | `#031B4E` | Footer, dark sections, hover state of primary |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-bg-soft` | `#F4F8FD` | Alternate sections, card backgrounds |
| `--color-border` | `#DCE4F2` | Borders and dividers |
| `--color-text` | `#0F1B33` | Body text |
| `--color-text-muted` | `#5B6B8A` | Secondary text |

Define all as CSS variables in one file. Never hardcode hex values in components.

### Typography
- Headings and UI: **Plus Jakarta Sans** (weights 500, 600, 700).
- Body and long articles: **Inter** (400, 500). Article body 18px, line-height 1.7.
- Code: **JetBrains Mono**.
- Load via a local or self-hosted font package if possible (avoid blocking third-party requests).

### Layout
- Max content width 1200px; article reading column about 720px.
- Generous white space, 8px spacing scale, border radius 12px on cards, subtle borders instead of heavy shadows.
- Fully responsive (mobile first). Navbar collapses to a menu on mobile.

### Logo assets
Place in `frontend/src/assets/logo/` and `frontend/public/`:
- `logo-horizontal.svg` (navbar, light background)
- `logo-horizontal-on-dark.svg` (footer)
- `logo-icon.svg`, `logo-icon-on-dark.svg`
- `favicon.svg`, `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`

Implement the logo as a single `<Logo />` component so the files can be replaced without touching any layout.

---

## 5. Site map and page requirements

Navbar: **Overview, Projects, Publications, Insights** and a **Contact** button (mailto). Logo links to Home.

### Home `/`
1. Hero: headline, subline, two buttons ("View projects", "Contact us"). Visual on the right (abstract data or simulation graphic, simple SVG is fine).
2. "What we do": 6 service cards (section 3).
3. Featured projects: 3 cards from the projects data, link to Projects.
4. Latest publications: 3 items, link to Publications.
5. Latest Insights: 3 articles, link to Insights.
6. Closing call to action: short text and email button.

### Overview `/overview`
- Profile of the founder: photo, name, title, affiliation, short bio, education, research interests, links (Google Scholar, ORCID, LinkedIn).
- Company profile: who we are, vision, mission, services (expanded), how we work (e.g. Understand, Model, Validate, Deliver), partners and institutions.
- Use placeholder bio text clearly marked as dummy until real text is provided.

### Projects `/projects` and `/projects/:slug`
- Card grid (unicage.eu style). Each card: thumbnail, title, short description, year, category tag, technology tags, and a clear "Live demo" or "Visit" indicator.
- Filter by category and search by keyword.
- **Each project must have a verifiable virtual proof** (live website, interactive simulation, or similar). A project without a proof link must not be shown.
- Card click opens a detail page with: description, role, outcomes, screenshots, technologies, and a prominent button to the external proof URL (opens in a new tab with `rel="noopener noreferrer"`).
- Real public projects to include (real URLs): Mangrove Analytics (`https://mangrove-analytics.ganeca10.id/`, mangrove carbon stock estimation, Pengudang) and Discover Pengudang (`https://discover-pengudang.ganeca10.id/home/`, tourism destination platform). Everything else is dummy for now.

### Publications `/publications`
- List of journal papers, **sorted by quartile first (Q1, then Q2, Q3, Q4), then newest year first within each quartile.**
- Each entry: title, authors (highlight the founder's name), journal, year, quartile badge, DOI or link.
- Filters: quartile and year. Search by title.
- Include a link to Google Scholar: `https://scholar.google.co.id/citations?user=ku9d3YgAAAAJ&hl=id`
- Known real item: IEEE Xplore document `https://ieeexplore.ieee.org/abstract/document/11512909` (title, authors, quartile to be filled in by the team).
- Data is maintained by the team in `content/publications.json`.

### Insights `/insights` and `/insights/:slug`
- Blog and technical articles, written in Markdown (`content/insights/*.md`).
- List page: article cards with title, date, tags, reading time, summary.
- Article page (Lilian Weng and Distill style): clean narrow column, auto-generated table of contents, heading anchors, figures with captions, code highlighting, LaTeX math (KaTeX), footnotes and references.
- Interactive simulations are **not** embedded. An article links out to the simulation at its own URL (for example an AnyLogic web model) through a clearly styled "Open simulation" call-out box.
- Seed with 2 example articles (dummy, topics such as "Agent-based simulation for population dynamics" and "Estimating mangrove carbon stock").

### Contact
No form. A footer section plus a dedicated block at the bottom of Home and Overview containing: email button (`mailto:`), address text box, and links (LinkedIn, Google Scholar, ORCID). Values come from one config file (`content/site.json`); use obvious placeholders until real values are provided.

### Footer
Logo (on dark), short description, navigation links, contact block, `© 2026 Meditya Wasesa Analytics`.

---

## 6. Content and confidentiality rules (important)

1. **Never write the names of real external clients** (state-owned enterprises, energy or fertilizer companies, or any named company) anywhere in code, data, comments, commit messages, or sample content. Use fictional labels such as "Energy sector client (dummy)".
2. Projects have `client_public: false` by default. When false, show only an anonymous sector label.
3. Every dummy item has `"dummy": true`. In development, show a small "Dummy" badge on dummy items. Provide `npm run check:content` that fails the production build if any item still has `dummy: true`.
4. ITB: refer to the founder's affiliation as text ("Lecturer, Institut Teknologi Bandung"). Do not use ITB logos or imply ITB endorses the company.
5. Community-service (pengabdian masyarakat) projects may be shown as category "Community project". Partner institutions (e.g. research institutes) are dummy for now.
6. No invented statistics, awards, testimonials, or client logos.

---

## 7. Data models

All content lives in `content/` as JSON and Markdown. No database for the site itself.

**`content/site.json`**
```json
{
  "name": "Meditya Wasesa Analytics",
  "tagline": "Data analysis, simulation, and machine learning for evidence-based decisions.",
  "email": "email@example.com",
  "address": "Placeholder address, Bandung, Indonesia",
  "links": { "linkedin": "", "scholar": "https://scholar.google.co.id/citations?user=ku9d3YgAAAAJ&hl=id", "orcid": "" },
  "umami": { "script": "https://stats.ganeca10.id/script.js", "websiteId": "" }
}
```

**`content/projects.json`** (array)
```json
{
  "slug": "mangrove-analytics",
  "title": "Mangrove Analytics",
  "summary": "Web platform estimating mangrove carbon stock in Pengudang.",
  "description": "Longer description in Markdown.",
  "year": 2025,
  "category": "Community project",
  "tags": ["Geospatial", "Carbon stock", "Web app"],
  "technologies": ["Python", "Flask", "React"],
  "proof_url": "https://mangrove-analytics.ganeca10.id/",
  "proof_type": "website",
  "thumbnail": "/images/projects/mangrove-analytics.jpg",
  "role": "Lead Analytics Consultant",
  "outcomes": [
    "Integrated field survey data with Sentinel-2 satellite imagery.",
    "Provided local leaders with verifiable carbon inventory maps."
  ],
  "highlights": [
    "Field & remote-sensing data integration",
    "Interactive carbon stock spatial mapping"
  ],
  "screenshots": [
    {
      "src": "/images/projects/mangrove-analytics.jpg",
      "alt": "Mangrove Analytics Dashboard",
      "caption": "Interactive mapping interface."
    }
  ],
  "client_label": "Community service, Institut Teknologi Bandung",
  "client_public": true,
  "featured": true,
  "dummy": false
}
```
`proof_type` is one of `website`, `simulation`, `dashboard`, `paper`, `video`. `proof_url` is required (must start with `https://`).

**`content/publications.json`** (array)
```json
{
  "id": "pub-001",
  "title": "Paper title",
  "authors": ["Meditya Wasesa", "Co-author"],
  "venue": "Journal name",
  "type": "journal",
  "year": 2026,
  "quartile": "Q1",
  "sjr_year": 2025,
  "doi": "10.1109/TEM.2026.11512909",
  "url": "https://ieeexplore.ieee.org/abstract/document/11512909",
  "pdf_url": "https://example.com/paper.pdf",
  "abstract": "Short paper abstract text.",
  "keywords": ["Simulation", "Supply Chain"],
  "dummy": true
}
```

**`content/insights/<slug>.md`** front matter
```yaml
---
title: "Agent-based simulation for population dynamics"
date: 2026-10-01
summary: "One or two sentences."
tags: ["simulation", "AnyLogic"]
author: "Dr. Meditya Wasesa"
simulation_url: "https://example.com/simulation"
cover: "/images/insights/example.jpg"
draft: false
dummy: true
updated: 2026-10-02
---
```

---

## 8. Technical stack and architecture

- **Frontend:** React with Vite, React Router, plain CSS with design tokens (CSS variables, optional CSS modules). Keep dependencies minimal. Markdown rendering with `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`, `rehype-slug`, and a lightweight code highlighter.
- **Backend:** Flask, a thin read-only JSON API serving the files in `content/`:
  - `GET /api/site`
  - `GET /api/projects`, `GET /api/projects/<slug>`
  - `GET /api/publications`
  - `GET /api/insights`, `GET /api/insights/<slug>`
  - `GET /api/health`
  Backend parses Markdown front matter, caches content in memory, and returns clean JSON. No authentication needed.
- **SEO:** unique title and meta description per page, Open Graph tags, `sitemap.xml` and `robots.txt` generated from the content.
- **Analytics:** Umami script loaded only in production from `site.json`. No cookie banner needed; do not add any other trackers.
- **Accessibility and performance:** semantic HTML, keyboard navigation, visible focus, alt text, WCAG AA contrast, lazy-loaded images, target Lighthouse 90+ on all categories.

### Folder structure
```
mwa-website/
  BRIEF.md
  PROMPTS.md
  content/
    site.json
    projects.json
    publications.json
    insights/*.md
  backend/
    app.py
    requirements.txt
  frontend/
    public/            (favicons, images)
    src/
      assets/logo/
      components/
      pages/
      styles/tokens.css
      main.jsx
    package.json
    vite.config.js
  deploy/
    nginx.conf.example
    mwa.service.example
```

### Deployment target (final stage only)
- VPS with Nginx. Nginx serves the built frontend for `ganeca10.id` and proxies `/api` to Gunicorn running the Flask app (systemd service).
- Add a new server block for `ganeca10.id` and `www.ganeca10.id` only. Do not modify any existing server block or subdomain.
- HTTPS with Let's Encrypt. Cache static assets with long expiry.
- Umami is installed separately at `stats.ganeca10.id` with PostgreSQL (not part of this codebase).
- MySQL exists on the server but this website does not use it.

---

## 9. Definition of done

- All five page types work and are responsive from 360px to 1440px.
- Logo and favicons appear correctly; naming rules in section 1 are respected everywhere.
- Projects only show items with a valid `proof_url`; publications sort as specified; Insights render math, code, and figures.
- No real external client names appear anywhere; `npm run check:content` works.
- Umami tracking works in production; Lighthouse scores meet the targets.
- Deployed without affecting existing subdomains.
