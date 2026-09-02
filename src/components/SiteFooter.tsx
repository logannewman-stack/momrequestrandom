export function SiteFooter() {
  return (
    <footer className="pt-9 pb-16">
      <p className="m-0 max-w-[68ch] text-[0.87rem]" style={{ color: 'var(--s-muted)' }}>
        Draft pricing model, version 2. Figures are internal and not for publication. Volume
        arrangements above 500 seats are negotiated, never listed.
      </p>
      <button
        type="button"
        onClick={() => window.print()}
        className="no-print mt-5 rounded-[3px] px-3 py-1.5 font-sans text-[12px] transition-colors"
        style={{
          border: '1px solid var(--s-rule)',
          background: 'var(--s-card)',
          color: 'var(--s-muted)',
        }}
      >
        Print or save as PDF
      </button>
    </footer>
  )
}
