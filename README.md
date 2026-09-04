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

## The enquiry form

Every call to action on the page points at one form in the `#start` section:
the header button, the hero, two contextual bands mid-page, and the closing
section itself. The form sends the reader's details **plus the scenario they
had on screen** — headcount, salary, turnover, multiple, case, and the
resulting cost and recovery figures — along with a link that reopens that exact
scenario.

### One setup step before it delivers

This is a static site, so a form service does the delivery. The default is
FormSubmit, which needs no account:

1. Deploy, then submit the form once.
2. FormSubmit emails **leahtfl@gmail.com** an activation link. Click it.
3. Every submission after that is delivered straight through.

Until that link is clicked, submissions are held rather than delivered.

### Keeping the address out of the bundle

The default endpoint contains the address in plain text, which means it ships
in the compiled JavaScript where scrapers can read it. Once the address is
activated, FormSubmit gives you a hashed endpoint that behaves identically.
Put it in `.env`:

```
VITE_FORM_ENDPOINT=https://formsubmit.co/ajax/your-hash-here
```

For GitHub Actions, add it as a repository variable or secret and expose it to
the `npm run build` step as `VITE_FORM_ENDPOINT`.

### Switching provider

Anything that accepts a JSON `POST` and answers 2xx works — Formspree,
Web3Forms, or your own handler. Set `VITE_FORM_ENDPOINT` and nothing else
changes. The payload shape and the FormSubmit-specific `_subject`, `_template`
and `_captcha` fields are in `src/lib/form.ts`.

### What is handled

Client-side validation on name and email, a honeypot field for bots, a
disabled button while sending, a success panel, and a failure message that
falls back to a `mailto:` link so an enquiry is never simply lost.

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

Matched to the innerboardos.com brand: a bone ground, warm near-black ink, and
a slate blue used as the accent. Primary buttons are a solid ink pill carrying
a small accent dot, as on the main site; in dark mode that pill inverts to
cream, since an ink pill would disappear into the ground.

Type follows the brand pairing. **Fraunces** carries the words — headings,
prose, navigation — set light rather than bold, the way the site sets it.
**Instrument Sans** carries the figures, tables, form controls and the
uppercase wide-tracked micro-labels (`.eyebrow`), because a display serif has
no tabular numerals and this page is full of numbers that must align.

### Changing the palette

`src/index.css` holds two named palettes, `--l-*` for light and `--d-*` for
dark. Every colour value in the design appears exactly once, in one of those
two blocks. The `--s-*` variables underneath are what components reference, and
they only ever point at a palette entry, so the two themes cannot drift apart
and no component names a raw colour.

To rebrand again, edit the two palettes and nothing else.

Both palettes were checked for WCAG AA contrast across every foreground and
background pairing actually used — body, muted, faint, accent text, and text on
buttons and tinted panels — in both themes.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on push to
the deployment branch. Enable Pages with "GitHub Actions" as the source. For a
project subpath, the workflow sets `BASE_PATH` automatically.
