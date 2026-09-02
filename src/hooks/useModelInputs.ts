import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_INPUTS, MAX_HEADCOUNT, SCENARIOS, type ModelInputs } from '../lib/pricing'

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

const LIMITS = {
  headcount: [1, MAX_HEADCOUNT],
  salary: [15000, 1_000_000],
  turnover: [0, 1],
  multiple: [1, 12],
} as const

/** Applies the bounds each field is edited within. */
export function normalize(next: Partial<ModelInputs>, base: ModelInputs): ModelInputs {
  const merged = { ...base, ...next }
  return {
    headcount: clamp(Math.round(merged.headcount) || 1, ...LIMITS.headcount),
    salary: clamp(Math.round(merged.salary) || DEFAULT_INPUTS.salary, ...LIMITS.salary),
    turnover: clamp(Number.isFinite(merged.turnover) ? merged.turnover : 0, ...LIMITS.turnover),
    multiple: clamp(merged.multiple || DEFAULT_INPUTS.multiple, ...LIMITS.multiple),
    scenario: SCENARIOS.some((s) => s.key === merged.scenario)
      ? merged.scenario
      : DEFAULT_INPUTS.scenario,
  }
}

function readFromUrl(): ModelInputs {
  if (typeof window === 'undefined') return DEFAULT_INPUTS
  const q = new URLSearchParams(window.location.search)
  const num = (key: string, fallback: number) => {
    const raw = q.get(key)
    const n = Number(raw)
    return raw !== null && Number.isFinite(n) ? n : fallback
  }
  return normalize(
    {
      headcount: num('headcount', DEFAULT_INPUTS.headcount),
      salary: num('salary', DEFAULT_INPUTS.salary),
      turnover: num('turnover', DEFAULT_INPUTS.turnover * 100) / 100,
      multiple: num('multiple', DEFAULT_INPUTS.multiple),
      scenario: (q.get('scenario') ?? DEFAULT_INPUTS.scenario) as ModelInputs['scenario'],
    },
    DEFAULT_INPUTS,
  )
}

/**
 * Five inputs drive every figure on the page, so they live once at the top and
 * mirror into the query string — a reader can send their own scenario to a
 * colleague and the recipient lands on exactly the same numbers.
 */
export function useModelInputs() {
  const [inputs, setInputsState] = useState<ModelInputs>(readFromUrl)

  const setInputs = useCallback((patch: Partial<ModelInputs>) => {
    setInputsState((current) => normalize(patch, current))
  }, [])

  // Debounced so dragging a slider does not flood the history API.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const url = new URL(window.location.href)
      const q = url.searchParams
      const put = (key: string, value: number | string, fallback: number | string) => {
        if (value === fallback) q.delete(key)
        else q.set(key, String(value))
      }
      put('headcount', inputs.headcount, DEFAULT_INPUTS.headcount)
      put('salary', inputs.salary, DEFAULT_INPUTS.salary)
      put('turnover', Math.round(inputs.turnover * 1000) / 10, DEFAULT_INPUTS.turnover * 100)
      put('multiple', inputs.multiple, DEFAULT_INPUTS.multiple)
      put('scenario', inputs.scenario, DEFAULT_INPUTS.scenario)
      window.history.replaceState(null, '', url)
    }, 250)
    return () => window.clearTimeout(id)
  }, [inputs])

  useEffect(() => {
    const onPop = () => setInputsState(readFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return [inputs, setInputs] as const
}
