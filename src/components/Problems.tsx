const PROBLEMS = [
  {
    title: 'The business leans on a few people',
    body: 'When the owner or a key manager is out, output drops. Decisions queue up and wait. That dependency caps growth and it shows up in valuation.',
  },
  {
    title: 'Managers spend the week on friction',
    body: 'Conflict, avoidance, and repeated conversations absorb the hours that were meant for the work. Gallup attributes roughly 70 percent of the variance in team engagement to managers.',
  },
  {
    title: 'Turnover keeps resetting the team',
    body: 'You hire, you train, they leave, you start again. Published estimates put the replacement cost of one person somewhere between half and two times their salary.',
  },
  {
    title: 'Performance depends on who is in the room',
    body: 'Without a shared standard, quality moves with mood and personality. What you get on a good day is not what you can count on.',
  },
]

export function Problems() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PROBLEMS.map((p) => (
        <div
          key={p.title}
          className="p-7"
          style={{
            background: 'var(--s-surface)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--s-shadow-sm)',
          }}
        >
          <h3 className="text-[17px] tracking-[-0.015em]">{p.title}</h3>
          <p className="mt-3 text-[14.5px] leading-[1.6]" style={{ color: 'var(--s-muted)' }}>
            {p.body}
          </p>
        </div>
      ))}
    </div>
  )
}
