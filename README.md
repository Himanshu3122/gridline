# Gridline — technical blog

A TechCrunch-style technical publication on AI infrastructure, data center power, smart grids and multi-agent AI. Built with Next.js (static export) for GitHub Pages.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Rename the publication

Edit `lib/data.ts`: `name`, `tagline`, `url` (the final deployed address) and `description`. Sections (categories) are defined in the same file.

## Write a new post

Add a Markdown file to `content/posts/`. The file name becomes the URL (`my-post.md` → `/posts/my-post/`).

```markdown
---
title: "Your headline"
dek: "One or two sentences that sell the story."
date: 2026-12-01
category: AI Infrastructure   # must match a category name in lib/data.ts
tags: [data-centers, grid]
featured: false               # true puts it in the lead slot on the front page
draft: false                  # true hides it
---

Body in Markdown. Math: inline $x^2$ and display $$\int_0^T \lambda(s)\,ds$$.
Code blocks get syntax highlighting. `##` / `###` headings build the table of contents.
```

Every post automatically gets a generated cover image, reading time, table of contents, "read next" suggestions, an RSS entry and a sitemap entry.

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.
In the repository settings, set **Pages → Source** to **GitHub Actions**.
The site is served from `https://himanshu3122.github.io/gridline/`. If you rename the repository, update `basePath` in both `next.config.mjs` and `lib/data.ts`, and `url` in `lib/data.ts`.

To link from one post to another, use a relative link: `[text](../other-post-name/)`.
