import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

export function Section({
  id,
  index,
  title,
  lede,
  children,
  last = false,
}: {
  id: string
  index: string
  title: string
  lede?: ReactNode
  children: ReactNode
  last?: boolean
}) {
  const ref = useReveal<HTMLElement>()
  return (
    <section
      id={id}
      ref={ref}
      className="reveal scroll-mt-24 py-14 sm:py-16"
      style={{ borderBottom: last ? 'none' : '1px solid var(--s-rule)' }}
      aria-labelledby={`${id}-title`}
    >
      <div className="mb-1.5 flex items-center gap-3">
        <span
          className="tnum font-sans text-[11px] font-semibold"
          style={{ color: 'var(--s-accent-text)' }}
        >
          {index}
        </span>
        <span className="h-px flex-1" style={{ background: 'var(--s-rule)' }} aria-hidden="true" />
      </div>
      <h2
        id={`${id}-title`}
        className="mb-2 text-[clamp(1.35rem,2.7vw,1.6rem)] font-semibold tracking-[-0.015em]"
        style={{ color: 'var(--s-heading)' }}
      >
        {title}
      </h2>
      {lede && (
        <p className="mb-7 max-w-[64ch] text-[1.02rem]" style={{ color: 'var(--s-muted)' }}>
          {lede}
        </p>
      )}
      {children}
    </section>
  )
}

export function Card({
  eyebrow,
  amount,
  unit,
  children,
}: {
  eyebrow: string
  amount: string
  unit: string
  children: ReactNode
}) {
  return (
    <div
      className="flex flex-col rounded-[4px] p-5 transition-transform duration-300 hover:-translate-y-0.5"
      style={{
        background: 'var(--s-card)',
        border: '1px solid var(--s-rule)',
        boxShadow: 'var(--s-shadow)',
      }}
    >
      <h3
        className="mb-2 font-sans text-[13px] font-semibold"
        style={{ color: 'var(--s-accent-text)' }}
      >
        {eyebrow}
      </h3>
      <div
        className="tnum font-sans text-[1.7rem] leading-none font-semibold"
        style={{ color: 'var(--s-heading)' }}
      >
        {amount}
      </div>
      <div className="mt-1.5 mb-3 font-sans text-xs" style={{ color: 'var(--s-muted)' }}>
        {unit}
      </div>
      <p className="m-0 text-[0.92rem] leading-[1.58]" style={{ color: 'var(--s-muted)' }}>
        {children}
      </p>
    </div>
  )
}

/** A metric rendered on the dark slab. */
export function Metric({
  label,
  value,
  hero = false,
  sub = false,
}: {
  label: string
  value: string
  hero?: boolean
  sub?: boolean
}) {
  return (
    <div
      className={hero ? 'col-span-full px-4 py-4 sm:px-5' : 'px-4 py-3.5 sm:px-5'}
      style={{ background: hero ? 'var(--s-slab-deep)' : 'var(--s-slab)' }}
    >
      <div
        className="mb-1 font-sans text-[10.5px] font-medium tracking-[0.05em] uppercase"
        style={{ color: 'var(--s-slab-muted)' }}
      >
        {label}
      </div>
      <div
        className="tnum font-sans font-semibold"
        style={{
          color: hero ? 'var(--color-green-glow)' : 'var(--s-slab-text)',
          fontSize: hero ? 'clamp(1.9rem,5vw,2.2rem)' : sub ? '1.1rem' : '1.35rem',
          lineHeight: 1.15,
        }}
      >
        {value}
      </div>
    </div>
  )
}
