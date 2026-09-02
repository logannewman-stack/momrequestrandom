import { PEOPLE_PER_LEADER, type Scenario } from '../lib/pricing'

const MAX_GROUPS = 6

/**
 * People as dots, grouped into the pods one certified leader can hold. Large
 * organizations truncate to six pods with the remainder stated, rather than
 * being silently under-drawn.
 */
export function RatioDots({ scenario: s }: { scenario: Scenario }) {
  const groups: number[] = []
  let placed = 0
  while (placed < s.headcount && groups.length < MAX_GROUPS) {
    const size = Math.min(PEOPLE_PER_LEADER, s.headcount - placed)
    groups.push(size)
    placed += size
  }
  const remaining = s.headcount - placed
  const hiddenLeaders = s.leaders - groups.length

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex flex-wrap justify-center gap-x-7 gap-y-5"
        role="img"
        aria-label={`${s.headcount} people grouped into pods of ${PEOPLE_PER_LEADER}, each led by one of ${s.leaders} certified leaders.`}
      >
        {groups.map((size, gi) => (
          <div key={gi} className="flex flex-wrap gap-2" style={{ maxWidth: 214 }}>
            {Array.from({ length: size }, (_, i) => (
              <span
                key={i}
                className="block h-3.5 w-3.5 rounded-full"
                style={{
                  background: i === 0 ? 'var(--s-accent)' : 'var(--s-surface-3)',
                  transition: 'background .4s var(--ease-gentle)',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <p className="tnum mt-6 text-[13px]" style={{ color: 'var(--s-faint)' }}>
          +{remaining.toLocaleString()} more
          {hiddenLeaders > 0 &&
            `, ${hiddenLeaders} further leader${hiddenLeaders === 1 ? '' : 's'}`}
        </p>
      )}

      <p
        className="mt-10 max-w-[38rem] text-center text-[15px] leading-[1.6]"
        style={{ color: 'var(--s-muted)' }}
      >
        Green marks a certified leader. At {s.headcount} {s.headcount === 1 ? 'person' : 'people'}{' '}
        the ratio requires{' '}
        <strong className="tnum font-semibold" style={{ color: 'var(--s-accent-text)' }}>
          {s.leaders}
        </strong>
        . The ratio is defensible as practice, and it is the line that keeps the system running
        after the engagement ends.
      </p>
    </div>
  )
}
