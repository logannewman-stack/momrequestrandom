/**
 * The pricing model, version 2.
 *
 * Every figure rendered anywhere on the site resolves through this module.
 * The source document carried the same constants in three places and they had
 * already drifted apart, so they live here once and only here.
 */

export type Band = {
  /** Inclusive upper bound of the band. */
  max: number
  /** Seat price per person per month within the band. */
  rate: number
  label: string
}

export const BANDS: Band[] = [
  { max: 24, rate: 30, label: '1 to 24' },
  { max: 74, rate: 25, label: '25 to 74' },
  { max: 199, rate: 21, label: '75 to 199' },
  { max: 499, rate: 18, label: '200 to 499' },
  { max: Infinity, rate: 15, label: '500 or more' },
]

/** One certified leader is required per this many people, rounded up. */
export const PEOPLE_PER_LEADER = 22

/** Certification is tiered by how many leaders an organization has certified. */
export const CERT_TIERS = [
  { throughLeader: 2, price: 3997 },
  { throughLeader: 5, price: 3497 },
  { throughLeader: Infinity, price: 2997 },
]

/** Annual credential renewal, per certified leader. */
export const RENEWAL_PER_LEADER = 797

/** Prepaying a year costs ten months rather than twelve. */
export const PREPAY_MONTHS = 10

/**
 * Benchmark spend on the external operating system a company already runs,
 * per person per year. Anchored to the ~$44,000 quoted for fifty people.
 */
export const EXTERNAL_OS_PER_PERSON = 880

export const MAX_HEADCOUNT = 2000

export function bandFor(headcount: number): Band {
  return BANDS.find((b) => headcount <= b.max) ?? BANDS[BANDS.length - 1]
}

export function seatRate(headcount: number): number {
  return bandFor(headcount).rate
}

export function leadersRequired(headcount: number): number {
  return Math.max(1, Math.ceil(headcount / PEOPLE_PER_LEADER))
}

/** Total one-time certification cost for the first `leaders` leaders. */
export function certificationCost(leaders: number): number {
  let total = 0
  for (let i = 1; i <= leaders; i++) {
    total += CERT_TIERS.find((t) => i <= t.throughLeader)!.price
  }
  return total
}

/** Price of the nth certified leader on their own. */
export function certificationPriceAt(leader: number): number {
  return CERT_TIERS.find((t) => leader <= t.throughLeader)!.price
}

export type Scenario = {
  headcount: number
  rate: number
  band: Band
  leaders: number
  /** Seats billed monthly across twelve months. */
  seatsAnnual: number
  /** Seats prepaid for the year, at two months off. */
  seatsPrepaid: number
  certification: number
  renewal: number
  /** Seats plus certification. */
  yearOne: number
  /** Seats plus credential renewal, year two onward. */
  recurring: number
  /** Year-one cost per person per month. */
  perPersonMonth: number
  externalOs: number
  /** Year one as a share of the external OS spend it sits underneath. */
  shareOfExternal: number
}

export function scenario(headcountInput: number): Scenario {
  const headcount = Math.max(1, Math.min(MAX_HEADCOUNT, Math.round(headcountInput) || 1))
  const band = bandFor(headcount)
  const rate = band.rate
  const leaders = leadersRequired(headcount)
  const seatsAnnual = headcount * rate * 12
  const certification = certificationCost(leaders)
  const renewal = leaders * RENEWAL_PER_LEADER
  const yearOne = seatsAnnual + certification
  const externalOs = headcount * EXTERNAL_OS_PER_PERSON

  return {
    headcount,
    rate,
    band,
    leaders,
    seatsAnnual,
    seatsPrepaid: headcount * rate * PREPAY_MONTHS,
    certification,
    renewal,
    yearOne,
    recurring: seatsAnnual + renewal,
    perPersonMonth: yearOne / headcount / 12,
    externalOs,
    shareOfExternal: yearOne / externalOs,
  }
}

/* ------------------------------------------------------------ formatting -- */

const usdFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const usdCentsFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const usd = (v: number) => usdFmt.format(Math.round(v))
export const usdCents = (v: number) => usdCentsFmt.format(v)
export const pct = (v: number) => `${Math.round(v * 100)}%`

/** The six organizations shown side by side. */
export const EXAMPLE_HEADCOUNTS = [12, 25, 50, 120, 300, 600]

/**
 * Year-one reference points for comparable systems at fifty people. These are
 * fixed to that size — they are quoted market figures, not modelled ones.
 */
export const MARKET_REFERENCES = [
  { name: 'EOS certified implementer', low: 36000, high: 52000 },
  { name: 'Scaling Up coaching', low: 30000, high: 30000 },
  { name: 'Ninety.io, software only', low: 9600, high: 9600, note: 'no delivery included' },
] as const

export const REFERENCE_HEADCOUNT = 50
