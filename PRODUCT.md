# Route Board (popular pages) — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `popular-pages`, evidence Prototype) on
> 2026-10-23.

## What it is

A client-only demo of a "popular pages" board over hard-coded sample traffic for four routes.

## Who it is for

A portfolio visitor who wants to see how a small route-performance board reads.

## What works today

1. Pick a read window (24H, 7D, 30D); each has its own authored sample.
2. The board ranks routes busiest first and computes the total, the top route and its share of the window; bars are
   scaled to the busiest route. Movement and status are authored per window.
3. `/api/mcp` answers JSON-RPC with `get_board` and `get_route` over the same sample (marked `sample: true`).
4. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No page-view aggregation, trending widget, category breakdown or use across 100+ projects (claims removed from the
  portfolio card in the 2026-10 review). The UI says "SAMPLE TRAFFIC" and "NO LIVE CONNECTION".
- No storage, account or analytics beyond Vercel Analytics.

## Live URL and deploy state

- Live: https://popular-pages.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-popular-pages-frontend` is deployed only by CLI (last production 2026-10-23 12:11,
  CLI deploy of commit fa65e91, the Next 16.4.2 security patch) and its Git link names the old repository
  `bookchaowalit/bookchaowalit-popular-pages-frontend`, so a push to `main` does not deploy. The live site lags `main`
  (window switch changes only a label, template MCP route, no Sentry) until the owner reconnects Vercel Git to this
  repository (owner action D9). `NEXT_PUBLIC_SENTRY_DSN` is already set on the Vercel project (Sentry project
  `marketing-popular-pages-web`, org `personal-yu0`).

## Boundaries

- Browser-only apart from the stateless `/api/mcp` route.
