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
  const yearOne = useAnimatedNumber(scenario.yearOne)
  const seatsAnnual = useAnimatedNumber(scenario.seatsAnnual)
  const certification = useAnimatedNumber(scenario.certification)
  const recurring = useAnimatedNumber(scenario.recurring)
  const perPerson = useAnimatedNumber(scenario.perPersonMonth)

  return (
    <div
      className="grid gap-px overflow-hidden md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]"
      style={{
        background: 'var(--s-hairline)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--s-shadow-lg)',
      }}
    >
      {/* Control side */}
      <div className="p-7 sm:p-8" style={{ background: 'var(--s-surface-2)' }}>
        <label
          htmlFor="headcount"
          className="block text-[13px]"
          style={{ color: 'var(--s-muted)' }}
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
          className="tnum mt-2 w-full bg-transparent text-[3rem] leading-none font-semibold tracking-[-0.04em] outline-none"
          style={{ color: 'var(--s-text)' }}
        />

        <input
          type="range"
          min={1}
          max={1000}
          value={Math.min(headcount, 1000)}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Headcount slider"
          className="mt-7"
          // Paints the travelled part of the track, the way a native slider does.
          style={
            {
              '--range-fill': `${((Math.min(headcount, 1000) - 1) / 999) * 100}%`,
            } as React.CSSProperties
          }
        />

        <div className="mt-7 flex flex-wrap gap-1">
          {PRESETS.map((n) => {
            const on = headcount === n
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                aria-pressed={on}
                className="tnum rounded-full px-2.5 py-1 text-[12.5px] transition-colors duration-300"
                style={{
                  background: on ? 'var(--s-accent)' : 'var(--s-surface)',
                  color: on ? '#fff' : 'var(--s-muted)',
                  boxShadow: on ? 'none' : 'var(--s-shadow-sm)',
                }}
              >
                {n}
              </button>
            )
          })}
        </div>

        <p className="mt-7 text-[12.5px] leading-[1.5]" style={{ color: 'var(--s-faint)' }}>
          One certified leader is required per {PEOPLE_PER_LEADER} people, rounded up, minimum one.
        </p>
      </div>

      {/*
        One live region: announcing six figures separately would flood a screen
        reader on every slider step.
      */}
      <div
        className="grid grid-cols-1 gap-px sm:grid-cols-2"
        style={{ background: 'var(--s-hairline)' }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="col-span-full" style={{ background: 'var(--s-surface)' }}>
          <Metric label="Year one, all in" value={usd(yearOne)} hero />
        </div>
        {[
          ['Seat rate', `$${scenario.rate}/mo`],
          ['Certified leaders', String(scenario.leaders)],
          ['Seats, annual', usd(seatsAnnual)],
          ['Certification, one time', usd(certification)],
          ['Recurring, year two on', usd(recurring)],
          ['Per person, per month', usdCents(perPerson)],
        ].map(([label, value]) => (
          <div key={label} style={{ background: 'var(--s-surface)' }}>
            <Metric label={label} value={value} />
          </div>
        ))}
      </div>
    </div>
  )
}
