import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

/**
 * Sections are separated by space alone — no numbers, no rules. The rhythm is
 * deliberately large; it is most of what makes the page feel calm.
 */
export function Section({
  id,
  title,
  lede,
  children,
  center = false,
}: {
  id: string
  title: string
  lede?: ReactNode
  children: ReactNode
  center?: boolean
}) {
  const ref = useReveal<HTMLElement>()
  return (
    <section
      id={id}
      ref={ref}
      className="reveal scroll-mt-28 py-16 sm:py-24"
      aria-labelledby={`${id}-title`}
    >
      <div className={center ? 'mx-auto max-w-[46rem] text-center' : ''}>
        <h2
          id={`${id}-title`}
          className="text-[clamp(1.75rem,4vw,2.6rem)]"
          style={{ color: 'var(--s-text)' }}
        >
          {title}
        </h2>
        {lede && (
          <p
            className={`mt-4 text-[clamp(1.02rem,1.7vw,1.2rem)] leading-[1.5] ${
              center ? 'mx-auto' : ''
            } max-w-[42rem]`}
            style={{ color: 'var(--s-muted)' }}
          >
            {lede}
          </p>
        )}
      </div>
      <div className="mt-10 sm:mt-12">{children}</div>
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
      className="flex flex-col p-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-1"
      style={{
        background: 'var(--s-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--s-shadow)',
        transitionTimingFunction: 'var(--ease-smooth)',
      }}
    >
      <h3
        className="text-[13px] font-medium tracking-normal"
        style={{ color: 'var(--s-accent-text)' }}
      >
        {eyebrow}
      </h3>
      <div
        className="tnum mt-4 text-[2rem] leading-none font-semibold tracking-[-0.03em]"
        style={{ color: 'var(--s-text)' }}
      >
        {amount}
      </div>
      <div className="mt-2 text-[13.5px]" style={{ color: 'var(--s-faint)' }}>
        {unit}
      </div>
      <p className="mt-5 text-[14.5px] leading-[1.55]" style={{ color: 'var(--s-muted)' }}>
        {children}
      </p>
    </div>
  )
}

/** A figure in the calculator panel. */
export function Metric({
  label,
  value,
  hero = false,
}: {
  label: string
  value: string
  hero?: boolean
}) {
  if (hero) {
    return (
      <div className="col-span-full px-7 pt-7 pb-6">
        <div className="text-[13px] font-medium" style={{ color: 'var(--s-muted)' }}>
          {label}
        </div>
        <div
          className="tnum mt-1.5 text-[clamp(2.6rem,7vw,3.6rem)] leading-none font-semibold tracking-[-0.035em]"
          style={{ color: 'var(--s-accent-text)' }}
        >
          {value}
        </div>
      </div>
    )
  }
  return (
    <div className="px-7 py-5">
      <div className="text-[12.5px]" style={{ color: 'var(--s-faint)' }}>
        {label}
      </div>
      <div
        className="tnum mt-1 text-[1.28rem] font-semibold tracking-[-0.02em]"
        style={{ color: 'var(--s-text)' }}
      >
        {value}
      </div>
    </div>
  )
}
