import type { ReactNode } from 'react'

const QUESTIONS: { q: string; a: ReactNode }[] = [
  {
    q: 'What is actually inside a seat?',
    a: 'An individual pays $30 a month and a five hundred person organization pays $15 for the same thing. Nobody has written down what that thing includes. This is the largest undefined item in the model and it shapes the build.',
  },
  {
    q: 'Perpetual or annual?',
    a: 'One earlier document sold a seat at $25 one time, owned forever. Every other document prices it annually. The WIN builder calls a paid model on every use, so a perpetual seat with unlimited usage gets worse the more someone loves it. Annual is the answer, and anyone already sold a perpetual seat should be grandfathered.',
  },
  {
    q: 'Does white label sit above all of this?',
    a: 'Co-branded is the default. White label is a paid upgrade, and partner deals of the ROR shape carry a prepaid annual minimum so the seat is both the tally and the skin in the game.',
  },
  {
    q: 'Where does the discount floor sit?',
    a: 'Certification is the margin engine and the moat. It should not fall below roughly $2,997 in any volume arrangement, which the third tier already sets.',
  },
]

export function OpenQuestions() {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        {QUESTIONS.map((item) => (
          <div key={item.q} className="pl-5" style={{ borderLeft: '3px solid var(--s-accent)' }}>
            <h3
              className="mb-1.5 font-sans text-[14.5px] font-semibold"
              style={{ color: 'var(--s-heading)' }}
            >
              {item.q}
            </h3>
            <p className="m-0 text-[0.95rem]" style={{ color: 'var(--s-muted)' }}>
              {item.a}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-7 rounded-[4px] px-5 py-4 text-[0.97rem]"
        style={{ background: 'var(--s-note-bg)', border: '1px solid var(--s-note-rule)' }}
        role="note"
      >
        <strong>One number to fix before anything is published.</strong> The live site, the DSO
        sheet, and the client facing page each carry a different seat price. If two of them reach
        the same buyer, or the same broker, the conversation stops being about value.
      </div>
    </>
  )
}
