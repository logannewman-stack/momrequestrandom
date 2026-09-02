export function Hero() {
  return (
    <header id="top" className="pt-20 pb-6 text-center sm:pt-32 sm:pb-10">
      <div
        className="inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] font-medium"
        style={{ background: 'var(--s-accent-soft)', color: 'var(--s-accent-text)' }}
      >
        Internal draft · Version 2
      </div>

      <h1 className="mx-auto mt-8 max-w-[18ch] text-[clamp(2.6rem,7.5vw,4.6rem)]">
        One seat. One price. Everything inside.
      </h1>

      <p
        className="mx-auto mt-7 max-w-[40rem] text-[clamp(1.08rem,2.1vw,1.3rem)] leading-[1.5]"
        style={{ color: 'var(--s-muted)' }}
      >
        This sits underneath whatever operating system a company already runs. Nothing is replaced.
        Organizations buy the same seat an individual buys, at volume, and the rate steps down as
        headcount rises. Certification is the only line sold separately.
      </p>

      <p className="mt-10 text-[13px]" style={{ color: 'var(--s-faint)' }}>
        Prepared for Abra · Draft for review
      </p>
    </header>
  )
}
