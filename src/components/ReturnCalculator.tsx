import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import {
  PEOPLE_PER_LEADER,
  SCENARIOS,
  usd,
  usdCents,
  type ModelInputs,
  type ReturnModel,
  type Scenario,
} from '../lib/pricing'
import { NumericInput } from './NumericInput'

function Line({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 py-3"
      style={{ borderBottom: '1px solid var(--s-hairline)' }}
    >
      <span className="text-[14.5px]" style={{ color: 'var(--s-muted)' }}>
        {label}
      </span>
      <span
        className="tnum text-[15px] font-semibold whitespace-nowrap"
        style={{ color: muted ? 'var(--s-muted)' : 'var(--s-text)' }}
      >
        {value}
      </span>
    </div>
  )
}

function Total({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="mt-5 flex items-baseline justify-between gap-4">
      <span className="text-[14.5px]" style={{ color: 'var(--s-muted)' }}>
        {label}
      </span>
      <span
        className="tnum text-[1.9rem] leading-none font-semibold tracking-[-0.03em]"
        style={{ color: accent ? 'var(--s-accent-text)' : 'var(--s-text)' }}
      >
        {value}
      </span>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
}: {
  id: string
  label: string
  value: number
  onChange: (n: number) => void
  min: number
  max: number
  step?: number
  prefix?: string
  suffix?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px]" style={{ color: 'var(--s-muted)' }}>
        {label}
      </label>
      <div className="field mt-2 flex items-baseline gap-1 px-4 py-3">
        {prefix && (
          <span className="text-[14px]" style={{ color: 'var(--s-faint)' }}>
            {prefix}
          </span>
        )}
        <NumericInput
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onCommit={onChange}
          inputMode={step && step < 1 ? 'decimal' : 'numeric'}
          className="tnum w-full bg-transparent text-[1.15rem] font-semibold outline-none"
          style={{ color: 'var(--s-text)' }}
        />
        {suffix && (
          <span className="text-[14px]" style={{ color: 'var(--s-faint)' }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export function ReturnCalculator({
  inputs,
  setInputs,
  cost,
  ret,
}: {
  inputs: ModelInputs
  setInputs: (patch: Partial<ModelInputs>) => void
  cost: Scenario
  ret: ReturnModel
}) {
  const yearOne = useAnimatedNumber(cost.yearOne)
  const recovery = useAnimatedNumber(ret.recovery)
  const net = useAnimatedNumber(ret.net)

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          id="salary"
          label="Average annual salary"
          prefix="$"
          value={inputs.salary}
          onChange={(n) => setInputs({ salary: n })}
          min={15000}
          max={1000000}
          step={1000}
        />
        <Field
          id="turnover"
          label="Annual turnover rate"
          value={Math.round(inputs.turnover * 1000) / 10}
          onChange={(n) => setInputs({ turnover: n / 100 })}
          min={0}
          max={100}
          step={0.5}
          suffix="%"
        />
        <Field
          id="multiple"
          label="Valuation multiple on earnings"
          value={inputs.multiple}
          onChange={(n) => setInputs({ multiple: n })}
          min={1}
          max={12}
          step={0.5}
          suffix="×"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5" role="group" aria-label="Improvement scenario">
        {SCENARIOS.map((s) => {
          const on = inputs.scenario === s.key
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setInputs({ scenario: s.key })}
              aria-pressed={on}
              className="rounded-full px-4 py-1.5 text-[13.5px] transition-colors duration-300"
              style={{
                background: on ? 'var(--s-action)' : 'var(--s-surface)',
                color: on ? 'var(--s-on-action)' : 'var(--s-muted)',
                boxShadow: on ? 'none' : 'var(--s-shadow-sm)',
                fontWeight: on ? 600 : 400,
              }}
            >
              {s.name}
            </button>
          )
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div
          className="p-7 sm:p-8"
          style={{
            background: 'var(--s-surface)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--s-shadow)',
          }}
        >
          <h3 className="text-[15px] font-medium" style={{ color: 'var(--s-muted)' }}>
            What you pay
          </h3>
          <div className="mt-4">
            <Line label="Seat rate" value={`$${cost.rate} per month`} />
            <Line label="Certified leaders required" value={String(cost.leaders)} />
            <Line label="Seats, twelve months" value={usd(cost.seatsAnnual)} />
            <Line label="Certification, one time" value={usd(cost.certification)} />
            <Line label="Recurring, year two forward" value={usd(cost.recurring)} muted />
          </div>
          <Total label="Year one, all in" value={usd(yearOne)} />
          <p className="mt-5 text-[12.5px] leading-[1.55]" style={{ color: 'var(--s-faint)' }}>
            That is {usdCents(cost.perPersonMonth)} per person per month in year one, and one
            certified leader for every {PEOPLE_PER_LEADER} people.
          </p>
        </div>

        <div
          className="p-7 sm:p-8"
          style={{ background: 'var(--s-accent-soft)', borderRadius: 'var(--radius-md)' }}
        >
          <h3 className="text-[15px] font-medium" style={{ color: 'var(--s-accent-text)' }}>
            What the model returns
          </h3>
          <div className="mt-4">
            <Line label="Fewer departures" value={usd(ret.turnoverRecovered)} />
            <Line label="Fewer absent days" value={usd(ret.absenceRecovered)} />
            <Line label="Capacity recovered from friction" value={usd(ret.capacityRecovered)} />
            <Line label="Less year one cost" value={`(${usd(cost.yearOne)})`} muted />
            <Line
              label="Departures avoided"
              value={`${ret.departuresAvoided.toFixed(1)} people`}
              muted
            />
          </div>
          <Total label="Net gain, year one" value={usd(net)} accent={ret.net >= 0} />
          <p className="mt-5 text-[12.5px] leading-[1.55]" style={{ color: 'var(--s-muted)' }}>
            {ret.scenario.name} case: turnover down {Math.round(ret.scenario.turnover * 100)}{' '}
            percent, absence down {Math.round(ret.scenario.absence * 100)} percent, capacity valued
            at {(ret.scenario.capacity * 100).toFixed(1)} percent of payroll. Modeled on published
            research, not a guarantee.
          </p>
        </div>
      </div>

      <div
        className="mt-4 grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4"
        style={{
          background: 'var(--s-hairline)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--s-shadow-sm)',
        }}
      >
        {[
          ['Return on year one spend', `${ret.returnOnSpend.toFixed(1)}×`],
          [
            'Payback period',
            ret.paybackMonths < 1 ? 'Under 1 month' : `${ret.paybackMonths.toFixed(1)} months`,
          ],
          ['Recovery per person, per year', usd(ret.recoveryPerPerson)],
          ['Turnover after the model', `${(ret.turnoverAfter * 100).toFixed(1)}%`],
        ].map(([k, v]) => (
          <div key={k} className="px-5 py-5" style={{ background: 'var(--s-surface)' }}>
            <div className="text-[12.5px] leading-[1.4]" style={{ color: 'var(--s-faint)' }}>
              {k}
            </div>
            <div
              className="tnum mt-1.5 text-[1.5rem] leading-none font-semibold tracking-[-0.025em]"
              style={{ color: 'var(--s-accent-text)' }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-[13px]" style={{ color: 'var(--s-faint)' }}>
        Recovery totals {usd(recovery)} a year at these assumptions.
      </p>
    </>
  )
}
