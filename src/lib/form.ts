import { usd, type ModelInputs, type ReturnModel, type Scenario } from './pricing'

/**
 * Where enquiries are delivered.
 *
 * This is a static site, so it cannot send mail itself — a form service does
 * the delivery. FormSubmit is the default because it needs no account: the
 * first submission triggers one activation email to the address below, and
 * every submission after that is delivered straight through.
 *
 * Override with VITE_FORM_ENDPOINT to switch provider, or to use FormSubmit's
 * hashed endpoint so the address is not readable in the built bundle. See the
 * README.
 */
export const FORM_ENDPOINT =
  import.meta.env.VITE_FORM_ENDPOINT ?? 'https://formsubmit.co/ajax/leahtfl@gmail.com'

/** Shown as a fallback if the form service cannot be reached. */
export const FALLBACK_EMAIL = 'leahtfl@gmail.com'

export type Enquiry = {
  name: string
  email: string
  company: string
  phone: string
  message: string
}

export const EMPTY_ENQUIRY: Enquiry = {
  name: '',
  email: '',
  company: '',
  phone: '',
  message: '',
}

export type FieldErrors = Partial<Record<keyof Enquiry, string>>

// Deliberately permissive: the goal is to catch typos, not to police addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validate(values: Enquiry): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.name.trim()) errors.name = 'Please add your name.'
  if (!values.email.trim()) errors.email = 'Please add an email address.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'That does not look like an email address.'
  return errors
}

/**
 * The scenario the reader had on screen, flattened into the email. Whoever
 * picks this up sees the numbers the enquiry was actually about.
 */
export function describeScenario(inputs: ModelInputs, cost: Scenario, ret: ReturnModel) {
  return {
    Headcount: String(inputs.headcount),
    'Average salary': usd(inputs.salary),
    'Turnover rate': `${Math.round(inputs.turnover * 1000) / 10}%`,
    'Valuation multiple': `${inputs.multiple}x`,
    'Improvement case': ret.scenario.name,
    'Seat rate': `$${cost.rate} per person per month`,
    'Certified leaders required': String(cost.leaders),
    'Year one cost': usd(cost.yearOne),
    'Recurring cost': usd(cost.recurring),
    'Modeled annual recovery': usd(ret.recovery),
    'Net gain, year one': usd(ret.net),
    'Added enterprise value': usd(ret.addedValue),
    'Scenario link': typeof window === 'undefined' ? '' : window.location.href,
  }
}

export async function submitEnquiry(
  values: Enquiry,
  scenario: Record<string, string>,
): Promise<void> {
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      Name: values.name.trim(),
      Email: values.email.trim(),
      Company: values.company.trim() || '—',
      Phone: values.phone.trim() || '—',
      Message: values.message.trim() || '—',
      ...scenario,
      // FormSubmit control fields.
      _subject: `InnerBoard OS enquiry — ${values.name.trim()}${
        values.company.trim() ? ` (${values.company.trim()})` : ''
      }`,
      _template: 'table',
      _captcha: 'false',
    }),
  })

  if (!response.ok) {
    throw new Error(`The form service returned ${response.status}.`)
  }
}
