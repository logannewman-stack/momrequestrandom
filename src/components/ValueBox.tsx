import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { usd, type ModelInputs, type ReturnModel } from '../lib/pricing'
import { Em } from './primitives'

export function ValueBox({ inputs, ret }: { inputs: ModelInputs; ret: ReturnModel }) {
  const value = useAnimatedNumber(ret.addedValue)

  return (
    <div
      className="grid items-center gap-9 p-8 sm:p-11 lg:grid-cols-[1fr_18rem]"
      style={{
        background: 'var(--s-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--s-shadow-lg)',
      }}
    >
      <div>
        <h2 className="max-w-[20ch] text-[clamp(1.6rem,3.4vw,2.3rem)]">
          The number that <Em>outlives the year</Em>
        </h2>
        <p
          className="mt-5 max-w-[56ch] text-[15.5px] leading-[1.65]"
          style={{ color: 'var(--s-muted)' }}
        >
          A company that cannot run without its owner is a job with a payroll attached. Buyers,
          lenders, and partners price that dependency, and they price it down.
        </p>
        <p
          className="mt-3 max-w-[56ch] text-[15.5px] leading-[1.65]"
          style={{ color: 'var(--s-muted)' }}
        >
          Self leadership installed across a team changes what the business is worth, because the
          earnings keep arriving whether or not any one person is in the building. At the
          assumptions you set, here is what the sustained gain adds at your multiple.
        </p>
      </div>

      <div className="lg:text-right">
        <div
          className="tnum text-[clamp(2.4rem,6vw,3.3rem)] leading-none font-semibold tracking-[-0.035em]"
          style={{ color: 'var(--s-accent-text)' }}
        >
          {usd(value)}
        </div>
        <div className="mt-4 text-[13px] leading-[1.5]" style={{ color: 'var(--s-faint)' }}>
          Added enterprise value at {inputs.multiple}× a sustained gain of{' '}
          <span className="tnum">{usd(Math.max(0, ret.sustained))}</span> a year
        </div>
      </div>
    </div>
  )
}
