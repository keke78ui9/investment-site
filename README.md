# Investment Site

A static investment site built with Next.js, hosted on GitHub Pages, with Cloudflare for CDN and custom domain.

## Stack

- **Next.js** (`output: 'export'`) — fully static
- **GitHub Actions** — CI/CD deploy to `gh-pages` branch
- **Cloudflare** — CDN, SSL, custom domain
- **Cloudflare Workers** _(Phase 2)_ — API proxy for market data
- **Supabase** _(Phase 2)_ — auth + DB
- **MDX** — blog posts

## Getting Started

```bash
npm install
npm run dev
```

## Deployment

Push to `main` — GitHub Actions builds and deploys to the `gh-pages` branch automatically.

**GitHub Pages settings required:**
- Source: GitHub Actions (not the legacy branch deploy)
- Set the `NEXT_PUBLIC_BASE_PATH` repository variable to `/your-repo-name` if using a project page URL, or leave unset for a custom domain.

## Project Structure

```
pages/
  index.jsx              # Home
  tools/
    index.jsx            # Tools listing
    rental-vs-mortgage.jsx
  blog/
    index.jsx            # Blog listing
    [slug].jsx           # Blog post
components/
  Layout.jsx
  Nav.jsx
posts/                   # MDX blog posts
workers/
  api-proxy/             # Cloudflare Worker (Phase 2)
.github/
  workflows/
    deploy.yml
```

## License

Tool code (e.g. `pages/tools/`) is released under the [MIT License](LICENSE).

Blog content (`posts/`) © [Your Name], all rights reserved. Blog posts may not be reproduced without permission.
