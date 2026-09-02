export function SiteFooter() {
  return (
    <footer className="py-14" style={{ borderTop: '1px solid var(--s-hairline)' }}>
      <p
        className="mx-auto max-w-[70ch] text-center text-[13px] leading-[1.65]"
        style={{ color: 'var(--s-faint)' }}
      >
        InnerBoard OS. Figures on this page are a planning model built from your inputs and from
        published research by Gallup and SHRM. They are an estimate of what is reasonable to expect,
        not a promise of results, and your outcome will depend on your team and your follow through.
      </p>
      <p className="mx-auto mt-3 text-center text-[13px]" style={{ color: 'var(--s-faint)' }}>
        Volume arrangements above 500 seats are quoted directly.
      </p>
      <div className="mt-7 text-center">
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print rounded-full px-4 py-2 text-[13px] transition-colors duration-300"
          style={{ background: 'var(--s-surface-2)', color: 'var(--s-muted)' }}
        >
          Print or save as PDF
        </button>
      </div>
    </footer>
  )
}
