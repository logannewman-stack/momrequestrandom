import { useEffect, useRef, useState } from 'react'

/**
 * A number field that lets you actually type.
 *
 * Clamping on every keystroke means clearing the box to retype snaps it to the
 * minimum, so changing 50 to 300 requires selecting all first. This keeps a
 * local draft while the field is focused, commits any value that parses, and
 * only clamps — or restores — when focus leaves.
 */
export function NumericInput({
  id,
  value,
  onCommit,
  min,
  max,
  step,
  className,
  style,
  'aria-describedby': describedBy,
  inputMode = 'numeric',
}: {
  id: string
  value: number
  onCommit: (n: number) => void
  min: number
  max: number
  step?: number
  className?: string
  style?: React.CSSProperties
  'aria-describedby'?: string
  inputMode?: 'numeric' | 'decimal'
}) {
  const [draft, setDraft] = useState(String(value))
  const focused = useRef(false)

  // Track changes made elsewhere (slider, presets, table rows, deep links).
  useEffect(() => {
    if (!focused.current) setDraft(String(value))
  }, [value])

  return (
    <input
      id={id}
      type="number"
      inputMode={inputMode}
      min={min}
      max={max}
      step={step}
      value={draft}
      aria-describedby={describedBy}
      className={className}
      style={style}
      onFocus={() => {
        focused.current = true
      }}
      onChange={(e) => {
        const next = e.target.value
        setDraft(next)
        const n = Number(next)
        // Commit anything parseable; leave an in-progress entry alone.
        if (next !== '' && Number.isFinite(n)) onCommit(n)
      }}
      onBlur={() => {
        focused.current = false
        const n = Number(draft)
        if (draft === '' || !Number.isFinite(n)) {
          setDraft(String(value))
          return
        }
        const clamped = Math.max(min, Math.min(max, n))
        setDraft(String(clamped))
        onCommit(clamped)
      }}
    />
  )
}
