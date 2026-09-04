import type { ReactNode } from 'react'

/** Every call to action on the page points at the one form. */
export const FORM_ANCHOR = '#start'

export function CtaButton({
  children = 'Book a walkthrough',
  tone = 'primary',
  size = 'md',
  className = '',
}: {
  children?: ReactNode
  tone?: 'primary' | 'quiet'
  size?: 'sm' | 'md'
  /**
   * Extra utilities. Do NOT pass display classes such as `hidden` — they
   * compete with this component's own `inline-block` and Tailwind resolves
   * the conflict by stylesheet order, not class order. Put visibility on a
   * wrapper element instead.
   */
  className?: string
}) {
  const primary = tone === 'primary'
  return (
    <a
      href={FORM_ANCHOR}
      className={`inline-flex items-center gap-2 rounded-full no-underline transition-transform duration-300 hover:-translate-y-0.5 ${
        size === 'sm' ? 'eyebrow px-4 py-1.5 text-[11px]' : 'eyebrow px-7 py-3.5 text-[12.5px]'
      } ${className}`}
      style={
        primary
          ? {
              background: 'var(--s-action)',
              color: 'var(--s-on-action)',
              boxShadow: 'var(--s-shadow)',
            }
          : {
              background: 'transparent',
              color: 'var(--s-text)',
              boxShadow: 'inset 0 0 0 1px var(--s-text)',
            }
      }
    >
      {primary && (
        <span
          aria-hidden="true"
          className="inline-block shrink-0 rounded-full"
          style={{
            width: size === 'sm' ? 5 : 7,
            height: size === 'sm' ? 5 : 7,
            background: 'var(--s-accent)',
          }}
        />
      )}
      {children}
    </a>
  )
}

/**
 * A quiet band used between sections, at the points where the reader has just
 * been given a reason to act. Deliberately low-contrast so repeating it three
 * times down the page does not read as pestering.
 */
export function CtaBand({
  heading,
  body,
  label,
}: {
  heading: string
  body: string
  label?: string
}) {
  return (
    <aside
      className="mt-14 flex flex-wrap items-center justify-between gap-6 px-7 py-7 sm:px-9"
      style={{ background: 'var(--s-accent-soft)', borderRadius: 'var(--radius-md)' }}
    >
      <div className="min-w-0">
        <p
          className="text-[17px] font-semibold tracking-[-0.015em]"
          style={{ color: 'var(--s-text)' }}
        >
          {heading}
        </p>
        <p
          className="mt-1.5 max-w-[46ch] text-[14.5px] leading-[1.55]"
          style={{ color: 'var(--s-muted)' }}
        >
          {body}
        </p>
      </div>
      <CtaButton>{label}</CtaButton>
    </aside>
  )
}
