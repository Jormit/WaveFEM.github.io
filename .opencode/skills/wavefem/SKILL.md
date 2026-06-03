---
name: wavefem
description: WaveFEM website — Eleventy static site built with Nunjucks templates and PicoCSS. Use when editing pages, templates, styles, scripts, or adding new content.
---

# WaveFEM Website

Static marketing site for WaveFEM, built with [Eleventy (11ty)](https://www.11ty.dev/).

## Project Structure

```
/
├── .eleventy.js              # Eleventy configuration
├── package.json              # npm scripts: build, dev
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions: builds + deploys to Pages
├── _includes/
│   └── base.njk              # Shared layout (head, nav, footer)
├── content/                  # All source content
│   ├── index.njk             # Home page
│   ├── about.njk             # About page
│   ├── examples.njk          # Examples page
│   ├── style.css             # Custom styles (PicoCSS overrides)
│   ├── scripts.js            # Gallery carousel logic
│   ├── CNAME                 # Custom domain (wavefem.com)
│   └── assets/               # Images and SVGs
│       ├── comparisons/
│       ├── features/
│       ├── gui/
│       ├── splashscreens/
│       └── ...
├── _site/                    # Build output (gitignored)
└── node_modules/             # Dependencies (gitignored)
```

## Key Conventions

- **Templating**: Nunjucks (`.njk`) — extends `base.njk` layout
- **CSS framework**: [PicoCSS v2](https://picocss.com/) (blue theme, loaded from CDN)
- **Page frontmatter**: each page sets `layout: base.njk`, optional `title`, `description`, `scripts`
- **Asset paths**: always root-relative (`/assets/...`, `/style.css`)
- **Active nav**: `aria-current="page"` is set automatically via `page.url` comparison

## Commands

```bash
npm run build    # Build site to _site/
npm run dev      # Build + serve with live reload at localhost:8080
```

## Adding a New Page

1. Create `content/new-page.njk`
2. Add frontmatter: `layout: base.njk`, `title`, `permalink: /new-page.html`
3. Write body content in Nunjucks HTML
4. Add nav link in `_includes/base.njk`

## Deployment

Deployed via **GitHub Actions** (`deploy.yml`). On every push to `main`:

1. `npm ci` installs dependencies
2. `npm run build` builds to `_site/`
3. `actions/upload-pages-artifact` uploads `_site/`
4. `actions/deploy-pages` deploys to GitHub Pages

**One-time setup:** In repo Settings → Pages → Source, select **"GitHub Actions"**.
The `CNAME` file is copied to `_site/` automatically, preserving the custom domain.
