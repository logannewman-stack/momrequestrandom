import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribeMotion(callback: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}

/**
 * Eases a figure toward its target so the calculator reads as a live
 * instrument rather than a set of values that blink.
 *
 * Under reduced motion the duration collapses to zero rather than branching
 * the return value, which keeps the settle path identical in both modes.
 */
export function useAnimatedNumber(target: number, duration = 520) {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const frameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const ms = reduced ? 0 : duration
    const from = fromRef.current
    const delta = target - from
    if (delta === 0) return

    const start = performance.now()
    const tick = (now: number) => {
      const t = ms === 0 ? 1 : Math.min(1, (now - start) / ms)
      // easeOutQuint — fast to settle, no overshoot on financial figures.
      const eased = 1 - Math.pow(1 - t, 5)
      const current = from + delta * eased
      fromRef.current = t < 1 ? current : target
      setValue(current)
      if (t < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, reduced])

  return value
}
