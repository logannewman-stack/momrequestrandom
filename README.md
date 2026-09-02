# InnerBoard OS — Pricing Model

An interactive presentation of the InnerBoard OS pricing model, version 2.

> **Internal draft.** Figures are internal and not for publication. The page is
> served with `noindex, nofollow`.

## What it does

Headcount is the single input. Everything else on the page — the seat band, the
number of certified leaders the ratio requires, year-one and recurring cost, the
comparison against existing operating-system spend, and the pod diagram —
derives from it and updates together.

The current scenario is mirrored into the query string, so `?headcount=300`
opens the page on exactly that case and can be sent to a reviewer as-is.

## Running it

```bash
npm install
npm run dev      # development server
npm run build    # production build into dist/
npm run preview  # serve the production build
npm run lint     # eslint
```

## Where the numbers live

`src/lib/pricing.ts` is the single source of truth: seat bands, the leader
ratio, the certification tiers, renewal, and the external-OS benchmark. No
figure is hard-coded in a component. The source document carried the same
constants in three places and they had already drifted, which is the problem
this module exists to prevent.

Changing a price means editing that one file.

## Notes carried over from the source document

- The static markup showed `$22,982` for the fifty-person year-one figure. That
  was a stale placeholder equal to twice the certification cost; the document's
  own script overwrote it with `$26,491` on load. The computed value is used.
- Ladder step heights are now proportional to the seat price. The original used
  hand-placed heights that did not match the prices they represented.
- The "way to hold this in a room" paragraph states the InnerBoard figure as a
  live percentage of external spend rather than the fixed "about half that
  again", so it stays true at every headcount. At fifty people it reads 60%.
- The market comparison bars are fixed at fifty people, since those are quoted
  market figures rather than modelled ones.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on push to
the deployment branch. Enable Pages with "GitHub Actions" as the source. For a
project subpath, the workflow sets `BASE_PATH` automatically.
