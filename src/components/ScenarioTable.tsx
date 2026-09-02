import {
  EXAMPLE_HEADCOUNTS,
  returnModel,
  scenario as buildScenario,
  usd,
  type ModelInputs,
} from '../lib/pricing'

const COLUMNS = [
  'Company size',
  'Seat rate',
  'Leaders',
  'Year one',
  'Recurring',
  'Modeled recovery',
]

export function ScenarioTable({
  inputs,
  onSelect,
}: {
  inputs: ModelInputs
  onSelect: (n: number) => void
}) {
  // Each row reruns the whole model at that size, using the reader's own
  // salary, turnover and scenario.
  const rows = EXAMPLE_HEADCOUNTS.map((n) => {
    const cost = buildScenario(n)
    const ret = returnModel({ ...inputs, headcount: n }, cost)
    return { n, cost, ret }
  })

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
            Cost and modeled recovery at six company sizes, using the assumptions set above
          </caption>
          <thead>
            <tr>
              {COLUMNS.map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  className={`px-5 py-4 text-[12.5px] font-medium ${
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
            {rows.map(({ n, cost, ret }) => {
              const current = n === inputs.headcount
              return (
                <tr
                  key={n}
                  onClick={() => onSelect(n)}
                  className="cursor-pointer transition-colors duration-300"
                  style={{ background: current ? 'var(--s-accent-soft)' : 'transparent' }}
                >
                  {[
                    `${n} people`,
                    `$${cost.rate}`,
                    cost.leaders,
                    usd(cost.yearOne),
                    usd(cost.recurring),
                    usd(ret.recovery),
                  ].map((cell, j) => (
                    <td
                      key={j}
                      className={`tnum px-5 py-4 text-[15px] ${j === 0 ? 'text-left' : 'text-right'}`}
                      style={{
                        borderTop: '1px solid var(--s-hairline)',
                        color:
                          j === 5
                            ? 'var(--s-accent-text)'
                            : j === 0
                              ? 'var(--s-text)'
                              : 'var(--s-muted)',
                        fontWeight: j === 5 || j === 0 ? 600 : 400,
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

      {/* Six columns cannot survive a phone. */}
      <div className="grid gap-2.5 sm:hidden">
        {rows.map(({ n, cost, ret }) => {
          const current = n === inputs.headcount
          return (
            <button
              key={n}
              type="button"
              onClick={() => onSelect(n)}
              className="p-5 text-left transition-colors duration-300"
              style={{
                background: current ? 'var(--s-accent-soft)' : 'var(--s-surface)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--s-shadow-sm)',
              }}
            >
              <div className="flex items-baseline justify-between">
                <span className="tnum text-[16px] font-semibold">{n} people</span>
                <span
                  className="tnum text-[16px] font-semibold"
                  style={{ color: 'var(--s-accent-text)' }}
                >
                  {usd(ret.recovery)}
                </span>
              </div>
              <div className="tnum mt-1.5 text-[13px]" style={{ color: 'var(--s-faint)' }}>
                {usd(cost.yearOne)} year one · ${cost.rate} per seat · {cost.leaders} leader
                {cost.leaders === 1 ? '' : 's'}
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
