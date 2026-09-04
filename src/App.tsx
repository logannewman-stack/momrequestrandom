import { useMemo } from 'react'
import { useModelInputs } from './hooks/useModelInputs'
import { useSettledAnnouncement } from './hooks/useSettledAnnouncement'
import { ALTERNATIVES_HEADCOUNT, returnModel, scenario as buildScenario, usd } from './lib/pricing'
import { Alternatives } from './components/Alternatives'
import { CtaBand } from './components/Cta'
import { Assumptions } from './components/Assumptions'
import { Hero } from './components/Hero'
import { PriceLadder } from './components/PriceLadder'
import { Problems } from './components/Problems'
import { ReturnCalculator } from './components/ReturnCalculator'
import { ScenarioTable } from './components/ScenarioTable'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { StartSection } from './components/StartSection'
import { ValueBox } from './components/ValueBox'
import { WhatGetsInstalled } from './components/WhatGetsInstalled'
import { Card, Em, Section } from './components/primitives'

export default function App() {
  const [inputs, setInputs] = useModelInputs()
  const cost = useMemo(() => buildScenario(inputs.headcount), [inputs.headcount])
  const ret = useMemo(() => returnModel(inputs, cost), [inputs, cost])

  const announcement = useSettledAnnouncement(
    `${inputs.headcount} people. Year one ${usd(cost.yearOne)}. ` +
      `Modeled annual recovery ${usd(ret.recovery)}, ${ret.scenario.name} case. ` +
      `Net gain ${usd(ret.net)}.`,
  )

  return (
    <>
      <a
        href="#problem"
        className="no-print sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:px-4 focus:py-2"
        style={{ background: 'var(--s-action)', color: 'var(--s-on-action)' }}
      >
        Skip to content
      </a>

      {/* Announced once the figures settle, rather than on every eased frame. */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <SiteHeader cost={cost} ret={ret} />

      <main className="mx-auto max-w-[62rem] px-6 sm:px-8">
        <Hero
          headcount={inputs.headcount}
          onHeadcount={(headcount) => setInputs({ headcount })}
          cost={cost}
          ret={ret}
        />

        <Section
          id="problem"
          center
          title={
            <>
              The problem this is <Em>bought to solve</Em>
            </>
          }
          lede="Most companies do not have a talent problem. They have a capacity problem sitting on top of mostly good people."
        >
          <Problems />
        </Section>

        <Section
          id="installed"
          center
          title={
            <>
              What gets <Em>installed</Em>
            </>
          }
          lede="Your business already runs on an operating system. For most companies that is EOS, or something homegrown that works well enough. We are not asking you to replace it. We are asking you to enhance it, by acknowledging that it sits on a layer of human performance that has not been trained, tracked, or certified."
        >
          <WhatGetsInstalled />
        </Section>

        <Section
          id="cost"
          center
          title={
            <>
              What it <Em>costs</Em>
            </>
          }
          lede="One seat, one price, everything inside. The rate steps down as headcount rises. A fifteen person practice and a five hundred person company buy the same product, and scale changes the price rather than the offering."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Card eyebrow="Seats" amount="$30 to $15" unit="per person, per month">
              Full app access for the team. Banded by headcount. Billed monthly, or prepaid annually
              at two months off.
            </Card>
            <Card eyebrow="Certification" amount="$3,997" unit="per certified leader, one time">
              Falls to $3,497 for the third through fifth leader, and $2,997 from the sixth on.
              Required at a set ratio to headcount.
            </Card>
            <Card eyebrow="Credential renewal" amount="$797" unit="per leader, per year">
              Keeps each certified leader current after year one. Begins in year two.
            </Card>
          </div>

          <div className="mt-14">
            <PriceLadder
              headcount={inputs.headcount}
              onSelect={(headcount) => setInputs({ headcount })}
            />
          </div>
        </Section>

        <Section
          id="numbers"
          center
          title={
            <>
              Your numbers, <Em>side by side</Em>
            </>
          }
          lede="Adjust the three assumptions below to match your business. The cost panel is fixed pricing. The return panel is a model, and you can see exactly how it is built."
        >
          <ReturnCalculator inputs={inputs} setInputs={setInputs} cost={cost} ret={ret} />

          <div className="mt-20">
            <h3 className="text-center text-[clamp(1.4rem,2.8vw,1.9rem)]">
              Six companies, side by side
            </h3>
            <p
              className="mx-auto mt-3 mb-9 max-w-[36rem] text-center text-[15.5px]"
              style={{ color: 'var(--s-muted)' }}
            >
              The same model run at six sizes, using the assumptions you set above.
            </p>
            <ScenarioTable inputs={inputs} onSelect={(headcount) => setInputs({ headcount })} />
          </div>

          <CtaBand
            heading="Want these numbers run against your actual payroll?"
            body="Send us the scenario you have on screen and we will pressure test it with your real salary bands, turnover, and roles before anyone talks about a contract."
            label="Book a walkthrough"
          />
        </Section>

        <Section
          id="method"
          center
          title={
            <>
              How the return is <Em>calculated</Em>
            </>
          }
          lede="Every figure above is built from your inputs and the assumptions below. Nothing is hidden, and the defaults sit at the cautious end of the published ranges on purpose."
        >
          <Assumptions />
        </Section>

        <Section
          id="alternatives"
          center
          title={
            <>
              What the alternatives cost, and <Em>who they reach</Em>
            </>
          }
          lede={`Year one for a ${ALTERNATIVES_HEADCOUNT} person company. The category prices as a barbell: inexpensive software with no delivery, or expensive outsourced implementation. Very little sits in between, and the difference that matters is not only the price. It is how far down the organization the money actually travels.`}
        >
          <Alternatives />

          <CtaBand
            heading="Not sure which layer is actually leaking?"
            body="The Company OS Score takes a few minutes and costs nothing. It tells you where the capacity is going before you spend anything on fixing it."
            label="Start with the score"
          />
        </Section>

        {/* ValueBox carries its own heading, so it is not wrapped in a Section. */}
        <div id="value" className="scroll-mt-28 py-16 sm:py-24">
          <ValueBox inputs={inputs} ret={ret} />
        </div>

        <StartSection inputs={inputs} cost={cost} ret={ret} />
        <SiteFooter />
      </main>
    </>
  )
}
