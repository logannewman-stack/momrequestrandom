export function SiteFooter() {
  return (
    <footer className="mt-8 py-14 text-center" style={{ borderTop: '1px solid var(--s-hairline)' }}>
      <p
        className="mx-auto max-w-[36rem] text-[13px] leading-[1.6]"
        style={{ color: 'var(--s-faint)' }}
      >
        Draft pricing model, version 2. Figures are internal and not for publication. Volume
        arrangements above 500 seats are negotiated, never listed.
      </p>
      <button
        type="button"
        onClick={() => window.print()}
        className="no-print mt-7 rounded-full px-4 py-2 text-[13px] transition-colors duration-300"
        style={{ background: 'var(--s-surface-2)', color: 'var(--s-muted)' }}
      >
        Print or save as PDF
      </button>
    </footer>
  )
}
