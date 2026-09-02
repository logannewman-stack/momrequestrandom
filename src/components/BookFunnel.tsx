import { Card } from './primitives'

export function BookFunnel() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card eyebrow="Score" amount="Free" unit="no account required">
          Company OS Score and one Personal OS Score. This is where every code in the book lands,
          and it is the top of the funnel.
        </Card>
        <Card eyebrow="Individual" amount="$30" unit="per month, or $300 a year">
          Full app for one person. The same seat an organization buys at band one, which keeps the
          story consistent if a reader later brings us to their company.
        </Card>
        <Card eyebrow="Team" amount="From $25" unit="per person, per month">
          Ten seat minimum. Adds the gap report and the WIN builder for whoever leads. This is where
          the ladder above begins.
        </Card>
      </div>

      <p
        className="mx-auto mt-12 max-w-[42rem] text-center text-[15.5px] leading-[1.6]"
        style={{ color: 'var(--s-muted)' }}
      >
        <strong style={{ color: 'var(--s-text)' }}>The build requirement this creates:</strong> the
        team layer has to be gated to an organization account. If an individual seat can generate a
        team link, ten people buy singles and the enterprise agreement is bypassed entirely.
      </p>
    </>
  )
}
