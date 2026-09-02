import { PEOPLE_PER_LEADER, type Scenario } from '../lib/pricing'

const MAX_GROUPS = 6

/**
 * People shown as dots, grouped into the pods one certified leader can hold.
 * The lead dot in each pod is the leader. Large organizations are truncated to
 * six pods with the remainder stated, rather than silently under-drawn.
 */
export function RatioDots({ scenario: s }: { scenario: Scenario }) {
  const groups: number[][] = []
  let placed = 0
  while (placed < s.headcount && groups.length < MAX_GROUPS) {
    const size = Math.min(PEOPLE_PER_LEADER, s.headcount - placed)
    groups.push(Array.from({ length: size }, (_, i) => placed + i))
    placed += size
  }
  const remaining = s.headcount - placed
  const hiddenLeaders = s.leaders - groups.length

  return (
    <div>
      <div
        className="flex max-w-[560px] flex-wrap items-center gap-x-5 gap-y-3"
        role="img"
        aria-label={`${s.headcount} people grouped into pods of ${PEOPLE_PER_LEADER}, each led by one of ${s.leaders} certified leaders.`}
      >
        {groups.map((group, gi) => (
          <div key={gi} className="flex flex-wrap gap-[5px]" style={{ maxWidth: 193 }}>
            {group.map((_, i) => {
              const lead = i === 0
              return (
                <span
                  key={i}
                  className="block h-[13px] w-[13px] rounded-full"
                  style={{
                    background: lead ? 'var(--s-accent)' : 'var(--s-rule)',
                    boxShadow: lead ? '0 0 0 3px var(--s-wash)' : undefined,
                  }}
                />
              )
            })}
          </div>
        ))}
        {remaining > 0 && (
          <span className="tnum font-sans text-[12px]" style={{ color: 'var(--s-muted)' }}>
            +{remaining.toLocaleString()} more
            {hiddenLeaders > 0 &&
              `, ${hiddenLeaders} further leader${hiddenLeaders === 1 ? '' : 's'}`}
          </span>
        )}
      </div>

      <p className="mt-4 max-w-[64ch] text-[0.92rem]" style={{ color: 'var(--s-muted)' }}>
        Green marks a certified leader. At {s.headcount} {s.headcount === 1 ? 'person' : 'people'}{' '}
        the ratio requires{' '}
        <strong style={{ color: 'var(--s-accent-text)' }} className="tnum">
          {s.leaders}
        </strong>
        . The ratio is defensible as practice and it is also the line that keeps the system running
        after the engagement ends.
      </p>
    </div>
  )
}
