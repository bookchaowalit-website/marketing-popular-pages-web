# Route Board (popular pages)

A route board over authored sample traffic: four portfolio routes with visits, movement and a status, for three read
windows (24H, 7D, 30D). Switching the window switches the sample; total, top route, its share and the bar widths are
computed from it. No analytics source is connected.

Live: https://popular-pages.bookchaowalit.com (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

## What it does not do

- No page-view collection or aggregation, no trending widget, no category breakdown, no cross-project tracking.
- Every number is sample data written in `lib/popular-pages.ts`.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: board arithmetic, MCP route, home page render, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Code map

- `lib/popular-pages.ts`: sample per window plus `rankRoutes`, `totalVisits`, `shareOfTotal`, `relativeShare`,
  `formatMovement` and `boardSummary` (used by the page and the MCP route).
- `app/api/mcp/route.ts`: stateless JSON-RPC endpoint with `get_board` and `get_route` over that sample.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when
  `NEXT_PUBLIC_SENTRY_DSN` is unset.
- `app/more-projects/page.tsx`: shared portfolio link page (copied per repository, not a package).
