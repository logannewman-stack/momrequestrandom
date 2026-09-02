const ITEMS = [
  {
    term: 'Replacement cost per departure.',
    body: 'Set at half of annual salary. Gallup and SHRM put the range at one half to two times salary depending on the role, so this page uses the bottom of that range.',
  },
  {
    term: 'Absence.',
    body: 'Five unscheduled days per person per year, valued at a working day of salary. Gallup reports that top quartile teams show substantially lower absenteeism than bottom quartile teams, by as much as 78 percent. The model claims a small fraction of that.',
  },
  {
    term: 'Turnover reduction.',
    body: "The conservative case models a 15 percent relative improvement. Gallup's meta analysis found top quartile teams running 18 percent lower turnover in high turnover organizations and 51 percent lower in low turnover organizations.",
  },
  {
    term: 'Capacity recovered.',
    body: 'The conservative case values recovered capacity at 2 percent of payroll, meaning about five minutes of an eight hour day returned to the work. Gallup associates top quartile engagement with 23 percent higher profitability and 14 to 18 percent higher productivity. This is the softest line on the page and it is deliberately the smallest claim.',
  },
  {
    term: 'Valuation.',
    body: 'Sustained annual gain net of recurring cost, multiplied by the earnings multiple you enter. Buyers pay for earnings that continue without the current owner in the chair, which is the point of the work.',
  },
  {
    term: 'What is excluded.',
    body: 'No claim is made here for revenue growth, customer retention, safety, error rates, or hiring speed, all of which the same research associates with healthier teams. Leaving them out keeps the number defensible.',
  },
]

export function Assumptions() {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {ITEMS.map((item) => (
        <div
          key={item.term}
          className="p-7"
          style={{
            background: 'var(--s-surface)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--s-shadow-sm)',
          }}
        >
          <dt className="text-[15px] font-semibold tracking-[-0.01em]">{item.term}</dt>
          <dd className="mt-2 ml-0 text-[14.5px] leading-[1.6]" style={{ color: 'var(--s-muted)' }}>
            {item.body}
          </dd>
        </div>
      ))}
    </dl>
  )
}
