import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { usd, type Scenario } from '../lib/pricing'

const SECTIONS = [
  { id: 'components', label: 'Components' },
  { id: 'ladder', label: 'Ladder' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'additive', label: 'Additive' },
  { id: 'ratio', label: 'Ratio' },
  { id: 'reader', label: 'Reader' },
  { id: 'open', label: 'Open' },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const order = ['light', 'system', 'dark'] as const
  const next = order[(order.indexOf(theme) + 1) % order.length]
  const icon = theme === 'light' ? '☀' : theme === 'dark' ? '☾' : '◐'
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={`Theme: ${theme}. Switch to ${next}.`}
      aria-label={`Theme: ${theme}. Switch to ${next}.`}
      className="grid h-8 w-8 place-items-center rounded-[3px] text-[13px] transition-colors"
      style={{ border: '1px solid var(--s-rule)', color: 'var(--s-muted)' }}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}

export function SiteHeader({ scenario }: { scenario: Scenario }) {
  const [active, setActive] = useState<string>('')
  const [docked, setDocked] = useState(false)

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > 220)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlights whichever section currently owns the upper part of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-84px 0px -62% 0px', threshold: 0 },
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className="no-print sticky top-0 z-50 backdrop-blur-md transition-shadow"
      style={{
        background: 'color-mix(in srgb, var(--s-bg) 88%, transparent)',
        borderBottom: docked ? '1px solid var(--s-rule)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex max-w-[1040px] items-center gap-4 px-6 py-2.5 sm:px-8">
        <a
          href="#top"
          className="shrink-0 font-sans text-[13px] font-semibold tracking-[-0.01em] no-underline"
          style={{ color: 'var(--s-heading)' }}
        >
          InnerBoard<span style={{ color: 'var(--s-accent-text)' }}> OS</span>
        </a>

        <nav
          aria-label="Sections"
          className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? 'true' : undefined}
              className="rounded-[3px] px-2 py-1 font-sans text-[12px] whitespace-nowrap no-underline transition-colors"
              style={{
                color: active === s.id ? 'var(--s-accent-text)' : 'var(--s-muted)',
                fontWeight: active === s.id ? 600 : 400,
              }}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          {/* The live scenario follows the reader down the page. */}
          <a
            href="#calculator"
            className="hidden items-center gap-2 rounded-[3px] px-2.5 py-1 font-sans text-[12px] no-underline transition-opacity sm:flex"
            style={{
              border: '1px solid var(--s-rule)',
              background: 'var(--s-card)',
              color: 'var(--s-muted)',
              opacity: docked ? 1 : 0,
              pointerEvents: docked ? 'auto' : 'none',
            }}
            aria-hidden={!docked}
            tabIndex={docked ? 0 : -1}
          >
            <span className="tnum">{scenario.headcount} people</span>
            <span aria-hidden="true" style={{ color: 'var(--s-rule)' }}>
              |
            </span>
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
