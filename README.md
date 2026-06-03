# WaveFEM Website

Static site built with [Eleventy](https://www.11ty.dev/).

## Getting Started

```bash
npm install
npm run dev      # Build + serve with live reload at localhost:8080
```

## Build

```bash
npm run build   # Outputs to _site/
```

## Project Structure

- `content/` — pages, styles, scripts, assets
- `_includes/base.njk` — shared layout
- `.github/workflows/deploy.yml` — auto-deploys to GitHub Pages on push to `main`

## Deploy

Push to `main` — the GitHub Action builds and deploys automatically.
