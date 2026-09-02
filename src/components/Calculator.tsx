import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { MAX_HEADCOUNT, PEOPLE_PER_LEADER, usd, usdCents, type Scenario } from '../lib/pricing'
import { Metric } from './primitives'

const PRESETS = [12, 50, 120, 300, 600]

export function Calculator({
  scenario,
  headcount,
  onChange,
}: {
  scenario: Scenario
  headcount: number
  onChange: (n: number) => void
}) {
  // Every figure eases toward its new value together.
  const yearOne = useAnimatedNumber(scenario.yearOne)
  const seatsAnnual = useAnimatedNumber(scenario.seatsAnnual)
  const certification = useAnimatedNumber(scenario.certification)
  const recurring = useAnimatedNumber(scenario.recurring)
  const perPerson = useAnimatedNumber(scenario.perPersonMonth)

  return (
    <div
      className="grid gap-8 rounded-[5px] p-6 sm:p-8 md:grid-cols-[268px_1fr] md:gap-10"
      style={{
        background: 'var(--s-slab)',
        color: 'var(--s-slab-text)',
        // Without this the slab is nearly flush with the page in dark mode.
        border: '1px solid var(--s-slab-rule)',
        boxShadow: 'var(--s-shadow)',
      }}
    >
      <div>
        <label
          htmlFor="headcount"
          className="mb-2 block font-sans text-[11px] font-medium tracking-[0.05em] uppercase"
          style={{ color: 'var(--s-slab-muted)' }}
        >
          Headcount
        </label>

        <input
          id="headcount"
          type="number"
          min={1}
          max={MAX_HEADCOUNT}
          value={headcount}
          onChange={(e) => onChange(Number(e.target.value))}
          className="tnum w-full rounded-[3px] px-3 py-2.5 font-sans text-[1.85rem] font-semibold"
          style={{
            background: 'var(--s-slab-input)',
            border: '1px solid var(--s-slab-input-rule)',
            color: 'var(--s-slab-text)',
          }}
        />

        <input
          type="range"
          min={1}
          max={1000}
          value={Math.min(headcount, 1000)}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Headcount slider"
          className="mt-4 w-full"
          style={{ accentColor: 'var(--color-green-bright)' }}
        />

        <div className="mt-4 flex flex-wrap gap-1.5">
          {PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={headcount === n}
              className="tnum rounded-[3px] px-2 py-1 font-sans text-[11.5px] transition-colors"
              style={{
                border: '1px solid var(--s-slab-input-rule)',
                background: headcount === n ? 'var(--color-green)' : 'transparent',
                color: headcount === n ? '#fff' : 'var(--s-slab-muted)',
              }}
            >
              {n}
            </button>
          ))}
        </div>

        <p className="mt-4 font-sans text-[11.5px] leading-[1.5]" style={{ color: '#8798aa' }}>
          One certified leader is required per {PEOPLE_PER_LEADER} people, rounded up, minimum one.
        </p>
      </div>

      {/*
        A single live region: announcing seven separately would flood a screen
        reader on every slider step.
      */}
      <div
        className="grid grid-cols-1 gap-px overflow-hidden rounded-[3px] sm:grid-cols-2"
        style={{ background: 'var(--s-slab-rule)', border: '1px solid var(--s-slab-rule)' }}
        aria-live="polite"
        aria-atomic="true"
      >
        <Metric label="Year one, all in" value={usd(yearOne)} hero />
        <Metric label="Seat rate" value={`$${scenario.rate}/mo`} />
        <Metric label="Certified leaders required" value={String(scenario.leaders)} />
        <Metric label="Seats, annual" value={usd(seatsAnnual)} sub />
        <Metric label="Certification, one time" value={usd(certification)} sub />
        <Metric label="Recurring, year two on" value={usd(recurring)} sub />
        <Metric label="Cost per person, per month" value={usdCents(perPerson)} sub />
      </div>
    </div>
  )
}
