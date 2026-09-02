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

/* ---------------------------------------------------------- return model -- */

/**
 * The return side is a planning model, not pricing. It is built from three
 * inputs the reader sets and a scenario multiplier, and every constant below
 * sits at the cautious end of the published ranges on purpose.
 */

export type ScenarioKey = 'conservative' | 'moderate' | 'strong'

export type ImprovementScenario = {
  key: ScenarioKey
  name: string
  /** Relative reduction in turnover. */
  turnover: number
  /** Relative reduction in unscheduled absence. */
  absence: number
  /** Capacity recovered, as a share of payroll. */
  capacity: number
}

export const SCENARIOS: ImprovementScenario[] = [
  { key: 'conservative', name: 'Conservative', turnover: 0.15, absence: 0.15, capacity: 0.02 },
  { key: 'moderate', name: 'Moderate', turnover: 0.25, absence: 0.25, capacity: 0.035 },
  { key: 'strong', name: 'Strong', turnover: 0.35, absence: 0.35, capacity: 0.05 },
]

export const scenarioFor = (key: ScenarioKey) =>
  SCENARIOS.find((s) => s.key === key) ?? SCENARIOS[0]

/** Unscheduled absent days per person per year. */
export const ABSENT_DAYS = 5
/** Replacement cost per departure, as a share of annual salary. */
export const REPLACEMENT_SHARE = 0.5
export const WORKDAYS = 260

export type ModelInputs = {
  headcount: number
  salary: number
  /** Annual turnover as a rate, e.g. 0.2 for 20 percent. */
  turnover: number
  /** Valuation multiple applied to sustained earnings. */
  multiple: number
  scenario: ScenarioKey
}

export const DEFAULT_INPUTS: ModelInputs = {
  headcount: 50,
  salary: 55000,
  turnover: 0.2,
  multiple: 4,
  scenario: 'conservative',
}

export type ReturnModel = {
  scenario: ImprovementScenario
  payroll: number
  /** Departures expected in a year at the entered turnover rate. */
  departures: number
  turnoverRecovered: number
  absenceRecovered: number
  capacityRecovered: number
  /** Everything the model claims back in year one. */
  recovery: number
  /** Recovery less the year-one cost. */
  net: number
  /** Recovery less the recurring cost, i.e. what continues after year one. */
  sustained: number
  departuresAvoided: number
  turnoverAfter: number
  returnOnSpend: number
  paybackMonths: number
  recoveryPerPerson: number
  addedValue: number
}

export function returnModel(inputs: ModelInputs, cost: Scenario): ReturnModel {
  const s = scenarioFor(inputs.scenario)
  const payroll = inputs.headcount * inputs.salary
  const departures = inputs.headcount * inputs.turnover

  const turnoverCost = departures * REPLACEMENT_SHARE * inputs.salary
  const absenceCost = inputs.headcount * ABSENT_DAYS * (inputs.salary / WORKDAYS)

  const turnoverRecovered = turnoverCost * s.turnover
  const absenceRecovered = absenceCost * s.absence
  const capacityRecovered = payroll * s.capacity
  const recovery = turnoverRecovered + absenceRecovered + capacityRecovered

  const sustained = recovery - cost.recurring

  return {
    scenario: s,
    payroll,
    departures,
    turnoverRecovered,
    absenceRecovered,
    capacityRecovered,
    recovery,
    net: recovery - cost.yearOne,
    sustained,
    departuresAvoided: departures * s.turnover,
    turnoverAfter: inputs.turnover * (1 - s.turnover),
    returnOnSpend: recovery / cost.yearOne,
    paybackMonths: recovery > 0 ? cost.yearOne / (recovery / 12) : Infinity,
    recoveryPerPerson: recovery / inputs.headcount,
    addedValue: Math.max(0, sustained * inputs.multiple),
  }
}

/* ------------------------------------------------------ the alternatives -- */

/**
 * Year one at fifty people. Reach is the point of this comparison: the same
 * spend travels to a very different number of people.
 */
export const ALTERNATIVES_HEADCOUNT = 50

export type Alternative = {
  name: string
  reach: string
  /** Year-one cost. `null` means take it from the pricing model. */
  cost: number | null
  people: number
  ours?: boolean
}

export const ALTERNATIVES: Alternative[] = [
  {
    name: 'InnerBoard OS, 50 people',
    reach: 'Reaches all 50, and the capability stays inside',
    cost: null,
    people: 50,
    ours: true,
  },
  {
    name: 'Business software alone',
    reach: 'Reaches all 50, delivers tooling rather than capability',
    cost: 9600,
    people: 50,
  },
  {
    name: 'Executive coaching program',
    reach: 'Reaches 2 people at the top',
    cost: 30000,
    people: 2,
  },
  {
    name: 'Outside implementer, year one',
    reach: 'Reaches a leadership team of 8',
    cost: 44000,
    people: 8,
  },
]

/** The six organizations shown side by side. */
export const EXAMPLE_HEADCOUNTS = [12, 25, 50, 120, 300, 600]
