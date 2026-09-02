import { EXAMPLE_HEADCOUNTS, scenario, usd } from '../lib/pricing'

const ROWS = EXAMPLE_HEADCOUNTS.map(scenario)
const COLUMNS = ['Organization', 'Rate', 'Leaders', 'Year one', 'Recurring']

export function ScenarioTable({
  headcount,
  onSelect,
}: {
  headcount: number
  onSelect: (n: number) => void
}) {
  return (
    <>
      <div
        className="hidden overflow-hidden sm:block"
        style={{
          background: 'var(--s-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--s-shadow)',
        }}
      >
        <table className="w-full border-collapse">
          <caption className="sr-only">
            Year one and recurring cost for six organization sizes
          </caption>
          <thead>
            <tr>
              {COLUMNS.map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  className={`px-6 py-4 text-[12.5px] font-medium ${
                    i === 0 ? 'text-left' : 'text-right'
                  }`}
                  style={{ color: 'var(--s-faint)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const current = r.headcount === headcount
              return (
                <tr
                  key={r.headcount}
                  onClick={() => onSelect(r.headcount)}
                  className="cursor-pointer transition-colors duration-300"
                  style={{ background: current ? 'var(--s-accent-soft)' : 'transparent' }}
                >
                  {[
                    `${r.headcount} people`,
                    `$${r.rate}`,
                    r.leaders,
                    usd(r.yearOne),
                    usd(r.recurring),
                  ].map((cell, j) => (
                    <td
                      key={j}
                      className={`tnum px-6 py-4 text-[15px] ${j === 0 ? 'text-left' : 'text-right'}`}
                      style={{
                        borderTop: '1px solid var(--s-hairline)',
                        color:
                          j === 3
                            ? 'var(--s-accent-text)'
                            : j === 0
                              ? 'var(--s-text)'
                              : 'var(--s-muted)',
                        fontWeight: j === 3 || j === 0 ? 600 : 400,
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

      {/* Five columns cannot survive a phone. */}
      <div className="grid gap-2.5 sm:hidden">
        {ROWS.map((r) => {
          const current = r.headcount === headcount
          return (
            <button
              key={r.headcount}
              type="button"
              onClick={() => onSelect(r.headcount)}
              className="p-5 text-left transition-colors duration-300"
              style={{
                background: current ? 'var(--s-accent-soft)' : 'var(--s-surface)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--s-shadow-sm)',
              }}
            >
              <div className="flex items-baseline justify-between">
                <span className="tnum text-[16px] font-semibold">{r.headcount} people</span>
                <span
                  className="tnum text-[16px] font-semibold"
                  style={{ color: 'var(--s-accent-text)' }}
                >
                  {usd(r.yearOne)}
                </span>
              </div>
              <div className="tnum mt-1.5 text-[13px]" style={{ color: 'var(--s-faint)' }}>
                ${r.rate} per seat · {r.leaders} leader{r.leaders === 1 ? '' : 's'} ·{' '}
                {usd(r.recurring)} recurring
              </div>
            </button>
          )
        })}
      </div>

      <p className="mt-6 text-center text-[13px]" style={{ color: 'var(--s-faint)' }}>
        Select a row to load it into the calculator.
      </p>
    </>
  )
}
