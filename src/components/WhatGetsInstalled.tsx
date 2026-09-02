const PIECES = [
  {
    title: 'A seat for the whole team',
    body: 'Seven modules delivered through the app: thought management, emotional regulation, capacity, personal power, and the social skills that hold a team together. The modules are short, accessible, and foundational. The day to day work becomes the practice, and the app becomes the extension of it.',
  },
  {
    title: 'Certified leaders inside your company',
    body: 'You certify your own people rather than renting an outside consultant. The capability stays on your payroll, appreciates, and holds the standard once we step back.',
  },
  {
    title: 'A score you can track',
    body: 'A Company OS Score and a Personal OS Score at the start, then again later. You get movement you can point at instead of opinions about culture.',
  },
]

export function WhatGetsInstalled() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {PIECES.map((p) => (
          <div
            key={p.title}
            className="p-7"
            style={{
              background: 'var(--s-surface)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--s-shadow)',
            }}
          >
            <h3 className="text-[17px] tracking-[-0.015em]">{p.title}</h3>
            <p className="mt-3 text-[14.5px] leading-[1.6]" style={{ color: 'var(--s-muted)' }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>

      <p
        className="mx-auto mt-12 max-w-[42rem] text-center text-[15.5px] leading-[1.6]"
        style={{ color: 'var(--s-muted)' }}
      >
        Nothing in your current system gets torn out. Your rocks, scorecards, and meeting rhythm
        stay where they are. The seats live in the app, the certified leaders are your own people,
        and the standard holds inside the meetings you already run.
      </p>
    </>
  )
}
