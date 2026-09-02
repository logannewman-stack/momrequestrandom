import { EXAMPLE_HEADCOUNTS, scenario, usd } from '../lib/pricing'

const ROWS = EXAMPLE_HEADCOUNTS.map(scenario)

export function ScenarioTable({
  headcount,
  onSelect,
}: {
  headcount: number
  onSelect: (n: number) => void
}) {
  return (
    <>
      {/* Table on wide screens. */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Year one and recurring cost for six organization sizes
          </caption>
          <thead>
            <tr>
              {['Organization', 'Seats', 'Rate', 'Leaders', 'Year one', 'Recurring'].map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  className={`px-2.5 py-2.5 font-sans text-[11.5px] font-semibold tracking-[0.05em] ${
                    i === 0 ? 'text-left' : 'text-right'
                  }`}
                  style={{
                    color: 'var(--s-muted)',
                    borderBottom: '2px solid var(--s-rule-strong)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => {
              const current = r.headcount === headcount
              return (
                <tr
                  key={r.headcount}
                  onClick={() => onSelect(r.headcount)}
                  className="cursor-pointer transition-colors"
                  style={{ background: current ? 'var(--s-wash)' : 'transparent' }}
                >
                  {[
                    `${r.headcount} people`,
                    r.headcount,
                    `$${r.rate}`,
                    r.leaders,
                    usd(r.yearOne),
                    usd(r.recurring),
                  ].map((cell, j) => (
                    <td
                      key={j}
                      className={`tnum px-2.5 py-2.5 ${j === 0 ? 'text-left' : 'text-right'}`}
                      style={{
                        borderBottom: i === ROWS.length - 1 ? 'none' : '1px solid var(--s-rule)',
                        color: j === 4 ? 'var(--s-accent-text)' : 'var(--s-text)',
                        fontWeight: j === 4 ? 600 : 400,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Stacked cards on phones, where six columns cannot survive. */}
      <div className="grid gap-2.5 sm:hidden">
        {ROWS.map((r) => (
          <button
            key={r.headcount}
            type="button"
            onClick={() => onSelect(r.headcount)}
            className="rounded-[4px] p-3.5 text-left"
            style={{
              background: r.headcount === headcount ? 'var(--s-wash)' : 'var(--s-card)',
              border: '1px solid var(--s-rule)',
            }}
          >
            <div className="flex items-baseline justify-between">
              <span className="tnum font-sans text-[15px] font-semibold">{r.headcount} people</span>
              <span
                className="tnum font-sans text-[15px] font-semibold"
                style={{ color: 'var(--s-accent-text)' }}
              >
                {usd(r.yearOne)}
              </span>
            </div>
            <div className="tnum mt-1 font-sans text-[12px]" style={{ color: 'var(--s-muted)' }}>
              ${r.rate}/seat · {r.leaders} leader{r.leaders === 1 ? '' : 's'} · {usd(r.recurring)}{' '}
              recurring
            </div>
          </button>
        ))}
      </div>
      <p className="mt-3 font-sans text-[12px]" style={{ color: 'var(--s-muted)' }}>
        Select a row to load it into the calculator.
      </p>
    </>
  )
}
