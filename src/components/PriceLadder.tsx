import { BANDS } from '../lib/pricing'

const VB = { w: 900, h: 330 }
const PLOT = { left: 60, right: 880, top: 75, baseline: 287 }
const RATES = BANDS.map((b) => b.rate)
const MAX_RATE = Math.max(...RATES)
const MIN_RATE = Math.min(...RATES)
const COL = (PLOT.right - PLOT.left) / BANDS.length

/**
 * Linear scale from seat rate to y. The source document used eyeballed step
 * heights that did not match the prices; this makes the steps proportional to
 * the money, which is the whole point of the picture.
 */
const yFor = (rate: number) =>
  PLOT.top + ((MAX_RATE - rate) / (MAX_RATE - MIN_RATE)) * (PLOT.baseline - 48 - PLOT.top)

/** A representative headcount inside a band, used when a step is clicked. */
function midpointOf(index: number): number {
  const lower = index === 0 ? 1 : BANDS[index - 1].max + 1
  const upper = BANDS[index].max
  return Number.isFinite(upper) ? Math.round((lower + upper) / 2) : 750
}

export function PriceLadder({
  headcount,
  onSelect,
}: {
  headcount: number
  onSelect: (n: number) => void
}) {
  const activeIndex = BANDS.findIndex((b) => headcount <= b.max)

  const stepPath = BANDS.map((b, i) => {
    const x0 = PLOT.left + i * COL
    const y = yFor(b.rate)
    return `${i === 0 ? `M${x0} ${y}` : `V${y}`} H${x0 + COL}`
  }).join(' ')

  return (
    <figure className="m-0">
      {/* Below ~620px the labels stop being readable, so the chart scrolls. */}
      <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="block h-auto w-full min-w-[560px]"
          role="img"
          aria-label={
            'Seat price steps down as headcount rises: ' +
            BANDS.map((b) => `$${b.rate} for ${b.label}`).join('; ') +
            `. Currently showing ${headcount} people at $${BANDS[activeIndex].rate}.`
          }
        >
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={PLOT.left}
              x2={PLOT.right}
              y1={PLOT.top + i * 60}
              y2={PLOT.top + i * 60}
              stroke="var(--s-rule)"
              strokeWidth={1}
            />
          ))}

          {BANDS.map((b, i) => {
            const x = PLOT.left + i * COL
            const y = yFor(b.rate)
            const active = i === activeIndex
            return (
              <g
                key={b.label}
                onClick={() => onSelect(midpointOf(i))}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Set headcount to the ${b.label} band at $${b.rate} per seat`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(midpointOf(i))
                  }
                }}
              >
                <rect
                  x={x}
                  y={y}
                  width={COL}
                  height={PLOT.baseline - y}
                  fill={
                    active
                      ? 'color-mix(in srgb, var(--s-accent) 20%, var(--s-bg))'
                      : 'var(--s-wash)'
                  }
                  style={{ transition: 'fill .35s var(--ease-out-quint)' }}
                />
                {/* Full-height hit area so the short bands stay easy to click. */}
                <rect
                  x={x}
                  y={PLOT.top - 40}
                  width={COL}
                  height={PLOT.baseline - PLOT.top + 40}
                  fill="transparent"
                />
                <text
                  x={x + 12}
                  y={y - 12}
                  className="tnum font-sans"
                  fontSize={active ? 21 : 19}
                  fontWeight={600}
                  fill={active ? 'var(--s-accent-text)' : 'var(--s-muted)'}
                  style={{ transition: 'fill .3s ease, font-size .3s ease' }}
                >
                  ${b.rate}
                </text>
                <text
                  x={x + 12}
                  y={PLOT.baseline + 21}
                  className="font-sans"
                  fontSize={12}
                  fontWeight={active ? 600 : 400}
                  fill={active ? 'var(--s-accent-text)' : 'var(--s-muted)'}
                >
                  {b.label}
                </text>
              </g>
            )
          })}

          <line
            x1={PLOT.left}
            x2={PLOT.right}
            y1={PLOT.baseline}
            y2={PLOT.baseline}
            stroke="var(--s-rule-strong)"
            strokeWidth={1.5}
          />

          <path
            d={stepPath}
            fill="none"
            stroke="var(--s-accent)"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />

          {/* Marker for where the current headcount sits inside its band. */}
          <g style={{ transition: 'transform .45s var(--ease-out-quint)' }}>
            <line
              x1={PLOT.left + activeIndex * COL}
              x2={PLOT.left + (activeIndex + 1) * COL}
              y1={yFor(BANDS[activeIndex].rate)}
              y2={yFor(BANDS[activeIndex].rate)}
              stroke="var(--s-accent)"
              strokeWidth={6}
              strokeLinecap="round"
            />
          </g>

          <text x={PLOT.left} y={26} className="font-sans" fontSize={11} fill="var(--s-muted)">
            Seat price per month
          </text>
          <text
            x={PLOT.right}
            y={26}
            textAnchor="end"
            className="font-sans"
            fontSize={11}
            fill="var(--s-muted)"
          >
            Headcount
          </text>
        </svg>
      </div>
      <figcaption className="mt-3 text-[12.5px]" style={{ color: 'var(--s-muted)' }}>
        Step heights are proportional to the seat price. Select a band to price that size.
      </figcaption>
    </figure>
  )
}
