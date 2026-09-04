import { BANDS } from '../lib/pricing'

const VB = { w: 900, h: 300 }
const PLOT = { left: 20, right: 880, top: 60, baseline: 240 }
const RATES = BANDS.map((b) => b.rate)
const MAX_RATE = Math.max(...RATES)
const MIN_RATE = Math.min(...RATES)
const COL = (PLOT.right - PLOT.left) / BANDS.length
const GAP = 10

/** Step heights are proportional to the seat rate. */
const yFor = (rate: number) =>
  PLOT.top + ((MAX_RATE - rate) / (MAX_RATE - MIN_RATE)) * (PLOT.baseline - 40 - PLOT.top)

/** A bar with rounded top corners and a square foot, so it sits on a baseline. */
function barPath(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, h, w / 2)
  const b = y + h
  return `M${x} ${b} V${y + rr} Q${x} ${y} ${x + rr} ${y} H${x + w - rr} Q${x + w} ${y} ${x + w} ${
    y + rr
  } V${b} Z`
}

function midpointOf(index: number): number {
  const lower = index === 0 ? 1 : BANDS[index - 1].max + 1
  const upper = BANDS[index].max
  return Number.isFinite(upper) ? Math.round((lower + upper) / 2) : 750
}

/**
 * Separated columns rather than a continuous staircase: with the rules and
 * gridlines gone, discrete rounded bars are what still reads as steps.
 */
export function PriceLadder({
  headcount,
  onSelect,
}: {
  headcount: number
  onSelect: (n: number) => void
}) {
  const activeIndex = BANDS.findIndex((b) => headcount <= b.max)

  return (
    <figure className="m-0">
      <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        {/*
          The chart is decorative and the bands are real buttons layered over
          it. Putting `role="button"` groups inside a `role="img"` svg made them
          invisible to assistive technology, because an image's contents are
          presentational.
        */}
        <div className="relative min-w-[520px]">
          <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="block h-auto w-full" aria-hidden="true">
            {BANDS.map((b, i) => {
              const x = PLOT.left + i * COL
              const y = yFor(b.rate)
              const active = i === activeIndex
              return (
                <g key={b.label}>
                  <path
                    d={barPath(x + GAP / 2, y, COL - GAP, PLOT.baseline - y, 14)}
                    fill={active ? 'var(--s-accent)' : 'var(--s-accent-mute)'}
                    style={{ transition: 'fill .5s var(--ease-smooth)' }}
                  />
                  <text
                    x={x + COL / 2}
                    y={y - 18}
                    textAnchor="middle"
                    className="tnum"
                    fontSize={26}
                    fontWeight={600}
                    letterSpacing="-0.03em"
                    fill={active ? 'var(--s-accent-text)' : 'var(--s-text)'}
                    style={{ transition: 'fill .4s var(--ease-gentle)' }}
                  >
                    ${b.rate}
                  </text>
                  <text
                    x={x + COL / 2}
                    y={PLOT.baseline + 28}
                    textAnchor="middle"
                    fontSize={14}
                    fill={active ? 'var(--s-text)' : 'var(--s-muted)'}
                    style={{ transition: 'fill .4s var(--ease-gentle)' }}
                  >
                    {b.label}
                  </text>
                </g>
              )
            })}
          </svg>

          <div
            role="group"
            aria-label="Seat price by headcount band"
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${BANDS.length}, 1fr)`,
              // Matches the plot inset inside the viewBox.
              paddingLeft: `${(PLOT.left / VB.w) * 100}%`,
              paddingRight: `${((VB.w - PLOT.right) / VB.w) * 100}%`,
            }}
          >
            {BANDS.map((b, i) => (
              <button
                key={b.label}
                type="button"
                onClick={() => onSelect(midpointOf(i))}
                aria-pressed={i === activeIndex}
                className="cursor-pointer rounded-[14px] bg-transparent"
                title={`Price the ${b.label} band`}
              >
                <span className="sr-only">
                  {`${b.label} people, $${b.rate} per seat per month`}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-6 text-center text-[13px]" style={{ color: 'var(--s-faint)' }}>
        Select a band to price that size.
      </figcaption>
    </figure>
  )
}
