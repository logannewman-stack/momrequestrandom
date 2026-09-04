import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { usd, type ReturnModel, type Scenario } from '../lib/pricing'
import { CtaButton } from './Cta'

const SECTIONS = [
  { id: 'problem', label: 'Problem' },
  { id: 'cost', label: 'Cost' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'method', label: 'Method' },
  { id: 'value', label: 'Value' },
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

export function SiteHeader({ cost, ret }: { cost: Scenario; ret: ReturnModel }) {
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
          className="shrink-0 text-[15px] font-medium tracking-[-0.01em] no-underline"
          style={{ color: 'var(--s-text)' }}
        >
          Inner<span style={{ color: 'var(--s-muted)' }}>Board</span> OS
        </a>

        <nav
          aria-label="Sections"
          className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-hidden lg:flex"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? 'true' : undefined}
              className="rounded-full px-3 py-1 text-[13px] whitespace-nowrap no-underline transition-colors duration-300"
              style={{
                color: active === s.id ? 'var(--s-accent-text)' : 'var(--s-faint)',
                fontWeight: active === s.id ? 500 : 400,
              }}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <a
            href="#numbers"
            className="hidden shrink-0 items-center gap-2.5 rounded-full px-3.5 py-1 text-[12.5px] whitespace-nowrap no-underline sm:flex lg:hidden xl:flex"
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
            <span className="tnum">{cost.headcount} people</span>
            <span className="tnum">{usd(cost.yearOne)}</span>
            <span className="tnum font-semibold" style={{ color: 'var(--s-accent-text)' }}>
              {usd(ret.recovery)} back
            </span>
          </a>
          {/*
            Visibility lives on a wrapper: passing `hidden` into CtaButton
            fights its own `inline-block`, and Tailwind resolves that by
            stylesheet order rather than class order.
          */}
          {/* "Begin" matches the site's own header button, and the uppercase
              full label overflowed the row at exactly 640px. */}
          <span className="hidden shrink-0 whitespace-nowrap sm:inline-block">
            <CtaButton size="sm">Begin</CtaButton>
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
