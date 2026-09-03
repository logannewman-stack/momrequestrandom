import { LeadForm } from './LeadForm'
import type { ModelInputs, ReturnModel, Scenario } from '../lib/pricing'

export function StartSection({
  inputs,
  cost,
  ret,
}: {
  inputs: ModelInputs
  cost: Scenario
  ret: ReturnModel
}) {
  return (
    <section id="start" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-[46rem] text-center">
        <h2 className="mx-auto max-w-[22ch] text-[clamp(1.9rem,4.4vw,2.9rem)]">
          See where your company actually stands
        </h2>
        <p
          className="mx-auto mt-6 max-w-[40rem] text-[clamp(1.02rem,1.9vw,1.18rem)] leading-[1.55]"
          style={{ color: 'var(--s-muted)' }}
        >
          Start with the Company OS Score. It takes a few minutes, it costs nothing, and it tells
          you which layer is leaking before you spend a dollar on fixing the wrong one.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-[46rem]">
        <LeadForm inputs={inputs} cost={cost} ret={ret} />
      </div>
    </section>
  )
}
