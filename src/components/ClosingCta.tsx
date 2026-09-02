export function ClosingCta() {
  return (
    <section className="py-20 text-center sm:py-28">
      <h2 className="mx-auto max-w-[20ch] text-[clamp(1.9rem,4.4vw,2.9rem)]">
        See where your company actually stands
      </h2>
      <p
        className="mx-auto mt-6 max-w-[40rem] text-[clamp(1.02rem,1.9vw,1.18rem)] leading-[1.55]"
        style={{ color: 'var(--s-muted)' }}
      >
        Start with the Company OS Score. It takes a few minutes, it costs nothing, and it tells you
        which layer is leaking before you spend a dollar on fixing the wrong one.
      </p>
      <a
        href="#top"
        className="mt-9 inline-block rounded-full px-7 py-3.5 text-[15.5px] font-semibold no-underline transition-transform duration-300 hover:-translate-y-0.5"
        style={{ background: 'var(--s-accent)', color: '#fff', boxShadow: 'var(--s-shadow)' }}
      >
        Book a walkthrough
      </a>
    </section>
  )
}
