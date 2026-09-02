import { useCallback, useEffect, useState } from 'react'
import { MAX_HEADCOUNT } from '../lib/pricing'

const PARAM = 'headcount'
const DEFAULT = 50

function readFromUrl(): number {
  if (typeof window === 'undefined') return DEFAULT
  const raw = new URLSearchParams(window.location.search).get(PARAM)
  const n = Number(raw)
  if (!raw || !Number.isFinite(n)) return DEFAULT
  return Math.max(1, Math.min(MAX_HEADCOUNT, Math.round(n)))
}

/**
 * Headcount drives every figure on the page, so it lives once at the top and
 * mirrors into the query string — a reviewer can send "?headcount=300" and the
 * recipient lands on exactly the scenario they were looking at.
 */
export function useHeadcount() {
  const [headcount, setHeadcountState] = useState(readFromUrl)

  const setHeadcount = useCallback((next: number) => {
    setHeadcountState(Math.max(1, Math.min(MAX_HEADCOUNT, Math.round(next) || 1)))
  }, [])

  // Debounced so dragging the slider doesn't flood the history API.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const url = new URL(window.location.href)
      if (headcount === DEFAULT) url.searchParams.delete(PARAM)
      else url.searchParams.set(PARAM, String(headcount))
      window.history.replaceState(null, '', url)
    }, 250)
    return () => window.clearTimeout(id)
  }, [headcount])

  useEffect(() => {
    const onPop = () => setHeadcountState(readFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return [headcount, setHeadcount] as const
}
