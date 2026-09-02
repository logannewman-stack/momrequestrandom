import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { usd, type Scenario } from '../lib/pricing'

const SECTIONS = [
  { id: 'components', label: 'Pricing' },
  { id: 'ladder', label: 'Scale' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'additive', label: 'Context' },
  { id: 'ratio', label: 'Ratio' },
  { id: 'reader', label: 'Readers' },
  { id: 'open', label: 'Open' },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const order = ['light', 'system', 'dark'] as const
  const next = order[(order.indexOf(theme) + 1) % order.length]
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={`Appearance: ${theme}. Switch to ${next}.`}
      aria-label={`Appearance: ${theme}. Switch to ${next}.`}
      className="grid h-8 w-8 place-items-center rounded-full text-[13px] transition-colors duration-300"
      style={{ background: 'var(--s-surface-2)', color: 'var(--s-muted)' }}
    >
      <span aria-hidden="true">{theme === 'light' ? '☀' : theme === 'dark' ? '☾' : '◐'}</span>
    </button>
  )
}

export function SiteHeader({ scenario }: { scenario: Scenario }) {
  const [active, setActive] = useState('')
  const [docked, setDocked] = useState(false)

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > 180)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-88px 0px -64% 0px', threshold: 0 },
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className="no-print sticky top-0 z-50"
      style={{
        background: 'var(--s-blur-bg)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: `1px solid ${docked ? 'var(--s-hairline)' : 'transparent'}`,
        transition: 'border-color .4s var(--ease-gentle)',
      }}
    >
      <div className="mx-auto flex h-13 max-w-[62rem] items-center gap-5 px-6 sm:px-8">
        <a
          href="#top"
          className="shrink-0 text-[14px] font-semibold tracking-[-0.02em] no-underline"
          style={{ color: 'var(--s-text)' }}
        >
          InnerBoard OS
        </a>

        <nav aria-label="Sections" className="hidden flex-1 items-center gap-0.5 lg:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? 'true' : undefined}
              className="rounded-full px-3 py-1 text-[13px] whitespace-nowrap no-underline transition-colors duration-300"
              style={{ color: active === s.id ? 'var(--s-text)' : 'var(--s-faint)' }}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <a
            href="#calculator"
            className="hidden items-center gap-2 rounded-full px-3 py-1 text-[12.5px] no-underline sm:flex"
            style={{
              background: 'var(--s-surface-2)',
              color: 'var(--s-muted)',
              opacity: docked ? 1 : 0,
              transform: docked ? 'none' : 'translateY(-4px)',
              pointerEvents: docked ? 'auto' : 'none',
              transition: 'opacity .45s var(--ease-smooth), transform .45s var(--ease-smooth)',
            }}
            aria-hidden={!docked}
            tabIndex={docked ? 0 : -1}
          >
            <span className="tnum">{scenario.headcount}</span>
            <span className="tnum font-semibold" style={{ color: 'var(--s-accent-text)' }}>
              {usd(scenario.yearOne)}
            </span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
