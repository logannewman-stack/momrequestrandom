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
      className="p-7"
      style={{
        background: ours ? 'var(--s-accent-soft)' : 'var(--s-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: ours ? 'none' : 'var(--s-shadow)',
      }}
    >
      <div className="text-[13px] font-medium" style={{ color: 'var(--s-muted)' }}>
        {label}
      </div>
      <div className="mt-0.5 text-[12.5px]" style={{ color: 'var(--s-faint)' }}>
        {sub}
      </div>
      <div
        className="tnum mt-4 text-[2.3rem] leading-none font-semibold tracking-[-0.035em]"
        style={{ color: ours ? 'var(--s-accent-text)' : 'var(--s-text)' }}
      >
        {amount}
      </div>
      <p
        className="mt-4 max-w-[46ch] text-[14.5px] leading-[1.55]"
        style={{ color: 'var(--s-muted)' }}
      >
        {note}
      </p>
    </div>
  )
}

/** Year-one market reference points, fixed at fifty people. */
function MarketBars() {
  const ref = buildScenario(REFERENCE_HEADCOUNT)
  const rows = [
    ...MARKET_REFERENCES.map((r) => ({ name: r.name, low: r.low, high: r.high, ours: false })),
    { name: 'InnerBoard OS', low: ref.yearOne, high: ref.yearOne, ours: true },
  ]
  const max = Math.max(...rows.map((r) => r.high))

  return (
    <figure className="m-0 mt-16">
      <figcaption className="text-[13px]" style={{ color: 'var(--s-muted)' }}>
        Year one at {REFERENCE_HEADCOUNT} people, compared
      </figcaption>
      <div className="mt-6 flex flex-col gap-4">
        {rows.map((r) => {
          const isRange = r.high !== r.low
          return (
            <div
              key={r.name}
              className="grid gap-1.5 sm:grid-cols-[10.5rem_1fr_7.5rem] sm:items-center sm:gap-4"
            >
              <div
                className="text-[14px]"
                style={{
                  color: r.ours ? 'var(--s-text)' : 'var(--s-muted)',
                  fontWeight: r.ours ? 600 : 400,
                }}
              >
                {r.name}
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full"
                style={{ background: 'var(--s-track)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    marginLeft: isRange ? `${(r.low / max) * 100}%` : 0,
                    width: isRange
                      ? `${((r.high - r.low) / max) * 100}%`
                      : `${(r.high / max) * 100}%`,
                    background: r.ours ? 'var(--s-accent)' : 'var(--s-faint)',
                    transition: 'width .6s var(--ease-smooth)',
                  }}
                />
              </div>
              <div
                className="tnum text-[13.5px] sm:text-right"
                style={{
                  color: r.ours ? 'var(--s-accent-text)' : 'var(--s-faint)',
                  fontWeight: r.ours ? 600 : 400,
                }}
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
      <div className="mx-auto max-w-[42rem]">
        <Tier
          label="What you already pay for"
          sub="External operating system, year one"
          amount={usd(s.externalOs)}
          note="Meetings, priorities, scorecards, structure. Unchanged. Not one dollar of this is displaced."
        />

        <div
          className="py-4 text-center text-[12px] tracking-wide"
          style={{ color: 'var(--s-faint)' }}
        >
          runs on
        </div>

        <Tier
          ours
          label="What we add underneath"
          sub={`InnerBoard OS, ${s.headcount} ${s.headcount === 1 ? 'person' : 'people'}, year one`}
          amount={usd(s.yearOne)}
          note="The people running all of it. Trained, measured, and certified inside the company."
        />
      </div>

      <p className="mx-auto mt-16 max-w-[42rem] text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.55]">
        A company at this size is already spending roughly{' '}
        <strong className="tnum font-semibold">{usd(s.externalOs)}</strong> a year on the system
        that organizes how the work gets done. The question is not whether to replace it. It is
        whether to spend another{' '}
        <strong className="tnum font-semibold" style={{ color: 'var(--s-accent-text)' }}>
          {sharePct}%
        </strong>{' '}
        of that on the only thing that decides whether the first number performs.
      </p>

      <p
        className="mx-auto mt-6 max-w-[42rem] text-[14.5px] leading-[1.6]"
        style={{ color: 'var(--s-muted)' }}
      >
        Reference points at {REFERENCE_HEADCOUNT} people: a certified EOS implementer runs roughly{' '}
        {usd(36000)} to {usd(52000)}; Scaling Up coaching lands near {usd(30000)}; software alone,
        such as Ninety.io, runs closer to {usd(9600)} and includes no delivery. Whichever of these a
        company runs, the number below it is the same.
      </p>

      <div className="mx-auto max-w-[42rem]">
        <MarketBars />
      </div>

      <p
        className="mx-auto mt-8 max-w-[42rem] text-[12.5px] leading-[1.6]"
        style={{ color: 'var(--s-faint)' }}
      >
        The external figure scales at {usd(EXTERNAL_OS_PER_PERSON)} per person per year, anchored to
        the {usd(REFERENCE_HEADCOUNT * EXTERNAL_OS_PER_PERSON)} quoted for {REFERENCE_HEADCOUNT}{' '}
        people. Comparison bars are fixed at that size, since those are quoted market figures rather
        than modelled ones.
      </p>
    </>
  )
}
