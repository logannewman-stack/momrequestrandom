export function Hero() {
  return (
    <header id="top" className="pt-14 pb-11 sm:pt-20 sm:pb-12">
      <div
        className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 font-sans text-[11px] font-medium tracking-[0.08em] uppercase"
        style={{
          background: 'var(--s-wash)',
          color: 'var(--s-accent-text)',
          border: '1px solid color-mix(in srgb, var(--s-accent) 24%, transparent)',
        }}
      >
        Internal draft · Version 2
      </div>

      <h1
        className="mb-4 text-[clamp(2.2rem,6.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.028em]"
        style={{ color: 'var(--s-heading)' }}
      >
        One seat. One price.
        <br />
        Everything inside.
      </h1>

      <p
        className="max-w-[58ch] text-[clamp(1.05rem,2.1vw,1.22rem)] leading-[1.5]"
        style={{ color: 'var(--s-standfirst)' }}
      >
        This sits underneath whatever operating system a company already runs. Nothing is replaced.
        Organizations buy the same seat an individual buys, at volume, and the rate steps down as
        headcount rises. Certification is the only line sold separately.
      </p>

      <p className="mt-6 font-sans text-[12.5px]" style={{ color: 'var(--s-muted)' }}>
        InnerBoard OS pricing model, version 2. Prepared for Abra. Draft for review.
      </p>
    </header>
  )
}
