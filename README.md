# InnerBoard OS

A client-facing page for InnerBoard OS: what it costs to install across a team,
and what published research says a company gets back.

## What it does

Five inputs drive the entire page — headcount, average salary, turnover rate,
valuation multiple, and an improvement scenario. Everything else derives from
them and updates together: seat band, certified leaders required, year-one and
recurring cost, the modeled recovery and its three components, the KPI strip,
the six-size table, and the enterprise-value figure.

The full scenario mirrors into the query string, so
`?headcount=120&salary=70000&turnover=28&multiple=5&scenario=moderate` opens on
exactly that case and can be sent to someone as-is.

## Running it

```bash
npm install
npm run dev        # development server
npm run build      # production build into dist/
npm run preview    # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc
```

## Where the numbers live

`src/lib/pricing.ts` is the single source of truth, in two halves:

- **Cost** — seat bands, the one-leader-per-22-people ratio, tiered
  certification, and renewal. These are prices, not estimates.
- **Return** — `returnModel()`, built from the reader's inputs and a scenario
  multiplier. Constants sit at the cautious end of the published ranges:
  replacement cost at half of salary, five unscheduled absent days a year, and
  capacity valued at 2 to 5 percent of payroll depending on scenario.

No figure is hard-coded in a component. Changing a price or an assumption means
editing that one file.

Both halves were checked against the source document's script before use — the
cost model across headcounts 1 to 2000, and the return model across 91,800
field comparisons spanning headcount, salary, turnover, multiple, and scenario.
All identical.

## Notes

- The page is now client-facing rather than an internal draft, so the
  `noindex, nofollow` directive that the earlier pricing memo carried has been
  removed. Restore it in `index.html` if this is not meant to be indexed.
- The model can go negative in year one at very small headcounts, where a
  single certification dominates the spend. That is the model being honest, and
  the figures render as negative rather than being clamped.
- Comparison figures in "What the alternatives cost" are fixed at 50 people,
  since they are quoted market rates rather than modelled ones.

## Design

Creamy, minimal, all-sans. Surfaces separate by tint and a soft shadow rather
than by rules, so the page carries almost no borders; sections are divided by
space alone. Self-hosted Inter is the only typeface. Light and dark are one set
of semantic variables in `src/index.css` — no component names a raw colour.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on push to
the deployment branch. Enable Pages with "GitHub Actions" as the source. For a
project subpath, the workflow sets `BASE_PATH` automatically.
