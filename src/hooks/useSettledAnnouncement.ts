import { useEffect, useState } from 'react'

/**
 * Announces a value only once it has stopped changing.
 *
 * The figures on this page ease toward their targets, so marking their
 * containers `aria-live` made a single slider nudge emit well over a hundred
 * DOM mutations — a screen reader would read the count-up frame by frame. One
 * debounced region carrying a settled summary is far more useful.
 */
export function useSettledAnnouncement(message: string, delay = 700) {
  const [settled, setSettled] = useState('')

  useEffect(() => {
    const id = window.setTimeout(() => setSettled(message), delay)
    return () => window.clearTimeout(id)
  }, [message, delay])

  return settled
}
