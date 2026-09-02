import {
  EXTERNAL_OS_PER_PERSON,
  MARKET_REFERENCES,
  REFERENCE_HEADCOUNT,
  scenario as buildScenario,
  usd,
  type Scenario,
} from '../lib/pricing'

function Tier({
  label,
  sub,
  amount,
  note,
  ours = false,
}: {
  label: string
  sub: string
  amount: string
  note: string
  ours?: boolean
}) {
  return (
    <div
      className="rounded-[4px] px-5 py-5"
      style={{
        background: ours ? 'var(--s-wash)' : 'var(--s-card)',
        border: ours ? '2px solid var(--s-accent)' : '1px solid var(--s-rule)',
      }}
    >
      <div className="font-sans text-[13px] font-semibold" style={{ color: 'var(--s-heading)' }}>
        {label}
        <span className="mt-0.5 block text-[12px] font-normal" style={{ color: 'var(--s-muted)' }}>
          {sub}
        </span>
      </div>
      <div
        className="tnum my-2 font-sans text-[1.85rem] leading-none font-semibold"
        style={{ color: ours ? 'var(--s-accent-text)' : 'var(--s-heading)' }}
      >
        {amount}
      </div>
      <p className="m-0 max-w-[52ch] text-[0.92rem]" style={{ color: 'var(--s-muted)' }}>
        {note}
      </p>
    </div>
  )
}

/** Year-one market reference points, fixed at fifty people. */
function MarketBars() {
  const ref = buildScenario(REFERENCE_HEADCOUNT)
  const rows = [
    ...MARKET_REFERENCES.map((r) => ({ ...r, ours: false })),
    { name: 'InnerBoard OS', low: ref.yearOne, high: ref.yearOne, note: '', ours: true },
  ]
  const max = Math.max(...rows.map((r) => r.high))

  return (
    <figure className="m-0 mt-7">
      <figcaption
        className="mb-3 font-sans text-[11px] font-semibold tracking-[0.07em] uppercase"
        style={{ color: 'var(--s-muted)' }}
      >
        Year one at {REFERENCE_HEADCOUNT} people, compared
      </figcaption>
      <div className="flex flex-col gap-2.5">
        {rows.map((r) => {
          const isRange = r.high !== r.low
          return (
            <div
              key={r.name}
              className="grid items-center gap-2 sm:grid-cols-[186px_1fr_118px] sm:gap-3.5"
            >
              <div
                className="font-sans text-[12.5px]"
                style={{
                  color: r.ours ? 'var(--s-accent-text)' : 'var(--s-text)',
                  fontWeight: r.ours ? 600 : 400,
                }}
              >
                {r.name}
              </div>
              <div
                className="h-[22px] overflow-hidden rounded-[2px]"
                style={{ background: 'var(--s-track)' }}
              >
                <div
                  className="h-full rounded-[2px]"
                  style={{
                    marginLeft: isRange ? `${(r.low / max) * 100}%` : 0,
                    width: isRange
                      ? `${((r.high - r.low) / max) * 100}%`
                      : `${(r.high / max) * 100}%`,
                    background: r.ours ? 'var(--s-accent)' : 'var(--s-standfirst)',
                    opacity: r.ours ? 1 : 0.55,
                    transition: 'width .5s var(--ease-out-quint)',
                  }}
                />
              </div>
              <div
                className="tnum font-sans text-[12.5px] font-semibold sm:text-right"
                style={{ color: r.ours ? 'var(--s-accent-text)' : 'var(--s-muted)' }}
              >
                {isRange ? `${usd(r.low)}–${usd(r.high)}` : usd(r.high)}
              </div>
            </div>
          )
        })}
      </div>
    </figure>
  )
}

export function AdditiveStack({ scenario: s }: { scenario: Scenario }) {
  const sharePct = Math.round(s.shareOfExternal * 100)

  return (
    <>
      <div className="max-w-[620px]">
        <Tier
          label="What you already pay for"
          sub="External operating system, year one"
          amount={usd(s.externalOs)}
          note="Meetings, priorities, scorecards, structure. Unchanged. Not one dollar of this is displaced."
        />

        <div
          className="relative py-2.5 text-center font-sans text-[11px] tracking-[0.08em]"
          style={{ color: 'var(--s-muted)' }}
        >
          <span
            className="absolute top-1/2 left-0 h-px w-[38%]"
            style={{ background: 'var(--s-rule)' }}
            aria-hidden="true"
          />
          runs on
          <span
            className="absolute top-1/2 right-0 h-px w-[38%]"
            style={{ background: 'var(--s-rule)' }}
            aria-hidden="true"
          />
        </div>

        <Tier
          ours
          label="What we add underneath"
          sub={`InnerBoard OS, ${s.headcount} ${s.headcount === 1 ? 'person' : 'people'}, year one`}
          amount={usd(s.yearOne)}
          note="The people running all of it. Trained, measured, and certified inside the company."
        />

        <div
          className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-sans text-[12px]"
          style={{
            background: 'var(--s-wash)',
            color: 'var(--s-accent-text)',
            border: '1px solid color-mix(in srgb, var(--s-accent) 24%, transparent)',
          }}
        >
          <span className="tnum font-semibold">{sharePct}%</span>
          <span>added on top of what is already being spent</span>
        </div>
      </div>

      <p className="mt-7 max-w-[68ch]">
        <strong>The way to hold this in a room:</strong> a company at this size is already spending
        roughly {usd(s.externalOs)} a year on the system that organizes how the work gets done. The
        question on the table is not whether to replace it. It is whether to spend another{' '}
        {sharePct}% of that on the only thing that decides whether the first number performs.
      </p>

      <p className="mt-3 max-w-[68ch] text-[0.92rem]" style={{ color: 'var(--s-muted)' }}>
        Reference points for the upper figure, year one at {REFERENCE_HEADCOUNT} people: a certified
        EOS implementer runs roughly {usd(36000)} to {usd(52000)}; Scaling Up coaching lands near{' '}
        {usd(30000)}; software alone, such as Ninety.io, runs closer to {usd(9600)} and includes no
        delivery. Whichever of these a company runs, the number below it is the same.
      </p>

      <MarketBars />

      <p className="mt-4 text-[0.86rem]" style={{ color: 'var(--s-muted)' }}>
        The external figure scales at {usd(EXTERNAL_OS_PER_PERSON)} per person per year, anchored to
        the {usd(REFERENCE_HEADCOUNT * EXTERNAL_OS_PER_PERSON)} quoted for {REFERENCE_HEADCOUNT}{' '}
        people. Comparison bars are fixed at that size, since those are quoted market figures rather
        than modelled ones.
      </p>
    </>
  )
}
