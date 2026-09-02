import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { MAX_HEADCOUNT, usd, type ReturnModel, type Scenario } from '../lib/pricing'

export function Hero({
  headcount,
  onHeadcount,
  cost,
  ret,
}: {
  headcount: number
  onHeadcount: (n: number) => void
  cost: Scenario
  ret: ReturnModel
}) {
  const yearOne = useAnimatedNumber(cost.yearOne)
  const recovery = useAnimatedNumber(ret.recovery)

  return (
    <header id="top" className="pt-16 pb-4 sm:pt-24 sm:pb-8">
      <div className="mx-auto max-w-[52rem] text-center">
        <h1 className="mx-auto max-w-[19ch] text-[clamp(2.2rem,6vw,3.9rem)]">
          Why would a company install an operating system for its people?
        </h1>

        <p
          className="mx-auto mt-7 max-w-[46rem] text-[clamp(1.08rem,2.1vw,1.28rem)] leading-[1.5]"
          style={{ color: 'var(--s-muted)' }}
        >
          You measure most of what moves in your business. Production, collections, hours,
          retention, margin.{' '}
          <strong className="font-semibold" style={{ color: 'var(--s-text)' }}>
            What rarely gets measured is the person responsible for the move.
          </strong>
        </p>

        <p
          className="mx-auto mt-5 max-w-[42rem] text-[15.5px] leading-[1.6]"
          style={{ color: 'var(--s-faint)' }}
        >
          Welcome to InnerBoard OS, the internal installation of self leadership. What it costs to
          install, and what the research says you get back.
        </p>
      </div>

      {/* The whole page hangs off this one number, so it is asked for immediately. */}
      <div
        className="mt-14 grid gap-px overflow-hidden md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]"
        style={{
          background: 'var(--s-hairline)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--s-shadow-lg)',
        }}
      >
        <div className="p-7 sm:p-8" style={{ background: 'var(--s-surface-2)' }}>
          <label
            htmlFor="hero-headcount"
            className="block text-[13px]"
            style={{ color: 'var(--s-muted)' }}
          >
            How many people do you employ?
          </label>
          <input
            id="hero-headcount"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_HEADCOUNT}
            value={headcount}
            onChange={(e) => onHeadcount(Number(e.target.value))}
            className="tnum mt-2 w-full bg-transparent text-[3rem] leading-none font-semibold tracking-[-0.04em] outline-none"
            style={{ color: 'var(--s-text)' }}
          />
          <input
            type="range"
            min={1}
            max={1000}
            value={Math.min(headcount, 1000)}
            onChange={(e) => onHeadcount(Number(e.target.value))}
            aria-label="Headcount slider"
            className="mt-7"
            style={
              {
                '--range-fill': `${((Math.min(headcount, 1000) - 1) / 999) * 100}%`,
              } as React.CSSProperties
            }
          />
          <p className="mt-6 text-[12.5px] leading-[1.5]" style={{ color: 'var(--s-faint)' }}>
            The whole page updates as you change this.
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-px sm:grid-cols-2"
          style={{ background: 'var(--s-hairline)' }}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="p-7 sm:p-8" style={{ background: 'var(--s-surface)' }}>
            <div className="text-[13px]" style={{ color: 'var(--s-muted)' }}>
              Year one investment
            </div>
            <div className="tnum mt-2 text-[clamp(2rem,4.5vw,2.7rem)] leading-none font-semibold tracking-[-0.035em]">
              {usd(yearOne)}
            </div>
            <div className="mt-3 text-[12.5px] leading-[1.5]" style={{ color: 'var(--s-faint)' }}>
              {usd(cost.seatsAnnual)} in seats plus {usd(cost.certification)} in certification
            </div>
          </div>

          <div className="p-7 sm:p-8" style={{ background: 'var(--s-surface)' }}>
            <div className="text-[13px]" style={{ color: 'var(--s-muted)' }}>
              Modeled annual recovery
            </div>
            <div
              className="tnum mt-2 text-[clamp(2rem,4.5vw,2.7rem)] leading-none font-semibold tracking-[-0.035em]"
              style={{ color: 'var(--s-accent-text)' }}
            >
              {usd(recovery)}
            </div>
            <div className="mt-3 text-[12.5px] leading-[1.5]" style={{ color: 'var(--s-faint)' }}>
              {ret.scenario.name} case, before growth
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
