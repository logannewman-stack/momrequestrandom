import {
  ALTERNATIVES,
  ALTERNATIVES_HEADCOUNT,
  scenario as buildScenario,
  usd,
} from '../lib/pricing'

const OURS = buildScenario(ALTERNATIVES_HEADCOUNT).yearOne
const ROWS = ALTERNATIVES.map((a) => ({ ...a, cost: a.cost ?? OURS }))
const MAX = Math.max(...ROWS.map((r) => r.cost))

/**
 * The comparison is about reach, not only price: the same spend travels to a
 * very different number of people, which is the argument the section makes.
 */
export function Alternatives() {
  return (
    <>
      <figure className="m-0">
        <div className="flex flex-col gap-5">
          {ROWS.map((r) => (
            <div
              key={r.name}
              className="grid gap-2 sm:grid-cols-[14rem_1fr_10.5rem] sm:items-center sm:gap-5"
            >
              <div>
                <div
                  className="text-[14.5px] leading-[1.3]"
                  style={{
                    color: r.ours ? 'var(--s-text)' : 'var(--s-text)',
                    fontWeight: r.ours ? 600 : 400,
                  }}
                >
                  {r.name}
                </div>
                <div
                  className="mt-1 text-[12.5px] leading-[1.4]"
                  style={{ color: 'var(--s-faint)' }}
                >
                  {r.reach}
                </div>
              </div>

              <div
                className="h-3 overflow-hidden rounded-full"
                style={{ background: 'var(--s-track)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(r.cost / MAX) * 100}%`,
                    background: r.ours ? 'var(--s-accent)' : 'var(--s-faint)',
                    transition: 'width .6s var(--ease-smooth)',
                  }}
                />
              </div>

              <div className="sm:text-right">
                <div
                  className="tnum text-[14.5px] font-semibold"
                  style={{ color: r.ours ? 'var(--s-accent-text)' : 'var(--s-text)' }}
                >
                  {usd(r.cost)}
                </div>
                <div className="tnum mt-1 text-[12.5px]" style={{ color: 'var(--s-faint)' }}>
                  {usd(r.cost / r.people)} per person
                </div>
              </div>
            </div>
          ))}
        </div>
      </figure>

      <p className="mt-8 text-[13px] leading-[1.6]" style={{ color: 'var(--s-faint)' }}>
        Implementer figures reflect published session rates across a typical first year. Software
        figures are per user, per month, at list price. Reach assumes a coaching program serving two
        senior people and an implementer engagement serving a leadership team of eight.
      </p>

      <div
        className="mt-10 p-8"
        style={{
          background: 'var(--s-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--s-shadow)',
        }}
      >
        <h3 className="mx-auto max-w-[62ch] text-[19px] tracking-[-0.02em]">
          Where this kind of training usually lands
        </h3>
        <p
          className="mx-auto mt-4 max-w-[62ch] text-[15px] leading-[1.65]"
          style={{ color: 'var(--s-muted)' }}
        >
          Standards, leadership skills, and training are normally bought for the top. Executives and
          team leads go through the program, and then they carry two jobs at once: hold the standard
          themselves, and teach, train, and enroll the rest of the organization in it. We have
          worked inside that model for decades and it tends to stall, because the cascade asks busy
          people to become trainers on top of the roles they were hired for.
        </p>
        <p
          className="mx-auto mt-4 max-w-[62ch] text-[15px] leading-[1.65]"
          style={{ color: 'var(--s-muted)' }}
        >
          InnerBoard OS offers the same tools at each level and in each role. When the person at the
          front desk and the person running the company have the same frameworks and the same words
          for what is happening, the standard stops being something that gets passed down and starts
          being something that is shared. Shared standard, shared language, available to the whole
          organization. That is what the price above is actually buying.
        </p>
      </div>
    </>
  )
}
