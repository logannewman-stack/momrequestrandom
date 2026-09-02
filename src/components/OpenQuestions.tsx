const QUESTIONS = [
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
      <div className="grid gap-4 md:grid-cols-2">
        {QUESTIONS.map((item) => (
          <div
            key={item.q}
            className="p-7"
            style={{
              background: 'var(--s-surface)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--s-shadow-sm)',
            }}
          >
            <h3 className="text-[16px] tracking-[-0.015em]" style={{ color: 'var(--s-text)' }}>
              {item.q}
            </h3>
            <p className="mt-3 text-[14.5px] leading-[1.6]" style={{ color: 'var(--s-muted)' }}>
              {item.a}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-4 p-7"
        style={{ background: 'var(--s-accent-soft)', borderRadius: 'var(--radius-md)' }}
        role="note"
      >
        <h3 className="text-[16px]" style={{ color: 'var(--s-accent-text)' }}>
          One number to fix before anything is published
        </h3>
        <p
          className="mt-3 max-w-[52rem] text-[14.5px] leading-[1.6]"
          style={{ color: 'var(--s-muted)' }}
        >
          The live site, the DSO sheet, and the client facing page each carry a different seat
          price. If two of them reach the same buyer, or the same broker, the conversation stops
          being about value.
        </p>
      </div>
    </>
  )
}
