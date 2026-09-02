import { useMemo } from 'react'
import { useHeadcount } from './hooks/useHeadcount'
import { PEOPLE_PER_LEADER, scenario as buildScenario } from './lib/pricing'
import { AdditiveStack } from './components/AdditiveStack'
import { BookFunnel } from './components/BookFunnel'
import { Calculator } from './components/Calculator'
import { Hero } from './components/Hero'
import { OpenQuestions } from './components/OpenQuestions'
import { PriceLadder } from './components/PriceLadder'
import { RatioDots } from './components/RatioDots'
import { ScenarioTable } from './components/ScenarioTable'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { Card, Section } from './components/primitives'

export default function App() {
  const [headcount, setHeadcount] = useHeadcount()
  const scenario = useMemo(() => buildScenario(headcount), [headcount])

  return (
    <>
      <a
        href="#components"
        className="no-print sr-only font-sans focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded focus:px-3 focus:py-2"
        style={{ background: 'var(--s-accent)', color: '#fff' }}
      >
        Skip to content
      </a>

      <SiteHeader scenario={scenario} />

      <main className="mx-auto max-w-[1040px] px-6 sm:px-8">
        <Hero />

        <Section
          id="components"
          index="01"
          title="Three components, one annual agreement"
          lede="Ninety days is a milestone in the product, not a term in the contract. The capstone stays where it is. The agreement runs a year."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Card eyebrow="Seats" amount="$30 to $15" unit="per person, per month">
              Full app access: membership, Academy, and the seven OS modules. Banded by headcount.
              Billed monthly, or prepaid annually at two months off.
            </Card>
            <Card eyebrow="Certification" amount="$3,997" unit="per certified leader, one time">
              Falls to $3,497 for the third through fifth leader, and $2,997 from the sixth on.
              Required at a set ratio to headcount.
            </Card>
            <Card eyebrow="Credential renewal" amount="$797" unit="per leader, per year">
              Keeps the leader current and the credential live. This is what turns certification
              from a one time sale into recurring revenue.
            </Card>
          </div>
        </Section>

        <Section
          id="ladder"
          index="02"
          title="The rate steps down as the organization grows"
          lede="A fifteen person practice and a five hundred person company buy the same product. Scale changes the price, not the offering."
        >
          <PriceLadder headcount={headcount} onSelect={setHeadcount} />
        </Section>

        <Section
          id="calculator"
          index="03"
          title="What a given organization pays"
          lede="Enter a headcount. Everything below recalculates, including how many certified leaders the ratio requires."
        >
          <Calculator scenario={scenario} headcount={headcount} onChange={setHeadcount} />
        </Section>

        <Section id="scenarios" index="04" title="Six organizations, side by side">
          <ScenarioTable headcount={headcount} onSelect={setHeadcount} />
        </Section>

        <Section
          id="additive"
          index="05"
          title="Nothing here replaces what you already bought"
          lede="This is not a switch and there is no rip and replace. Whatever runs your business externally stays exactly where it is. What we install is the layer underneath it, and that layer is what determines whether the money you have already spent returns what you hoped for when you spent it."
        >
          <AdditiveStack scenario={scenario} />
        </Section>

        <Section
          id="ratio"
          index="06"
          title="Why the ratio matters more than the seat"
          lede={`One certified leader per ${PEOPLE_PER_LEADER} people. Below that the standard has nobody holding it once we step back, and the install decays. Above it, the leader is carrying too many people to coach any of them well.`}
        >
          <RatioDots scenario={scenario} />
        </Section>

        <Section
          id="reader"
          index="07"
          title="The reader who arrives from the book"
          lede={
            <>
              This is new since version one, and the model did not previously account for it. Every
              QR code in <em>Replaceable</em> points at the app. A person who just paid for a book
              will not buy a seat priced for a company.
            </>
          }
        >
          <BookFunnel />
        </Section>

        <Section id="open" index="08" title="Still open" last>
          <OpenQuestions />
        </Section>

        <SiteFooter />
      </main>
    </>
  )
}
