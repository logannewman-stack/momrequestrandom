import { useId, useState } from 'react'
import {
  EMPTY_ENQUIRY,
  FALLBACK_EMAIL,
  describeScenario,
  submitEnquiry,
  validate,
  type Enquiry,
  type FieldErrors,
} from '../lib/form'
import type { ModelInputs, ReturnModel, Scenario } from '../lib/pricing'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * A fetch rejection carries "Failed to fetch", which reads as debris in a
 * sentence. Normalise the wording and the punctuation.
 */
function describeFailure(error: unknown): string {
  if (error instanceof TypeError) return 'The connection did not complete.'
  if (error instanceof Error && error.message) {
    return error.message.endsWith('.') ? error.message : `${error.message}.`
  }
  return 'Something went wrong.'
}

function Input({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  optional,
  rows,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  autoComplete?: string
  optional?: boolean
  rows?: number
}) {
  const errorId = `${id}-error`
  const shared = {
    id,
    value,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className: 'w-full bg-transparent text-[15.5px] outline-none',
    style: { color: 'var(--s-text)' },
  }

  return (
    <div className={rows ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="flex items-baseline gap-2 text-[13px]">
        <span style={{ color: 'var(--s-muted)' }}>{label}</span>
        {optional && (
          <span className="text-[12px]" style={{ color: 'var(--s-faint)' }}>
            optional
          </span>
        )}
      </label>
      <div
        className="mt-2 px-4 py-3"
        style={{
          background: 'var(--s-surface)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: error ? 'inset 0 0 0 1.5px var(--s-danger)' : 'var(--s-shadow-sm)',
        }}
      >
        {rows ? (
          <textarea {...shared} rows={rows} className={`${shared.className} resize-y`} />
        ) : (
          <input {...shared} type={type} />
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-[12.5px]" style={{ color: 'var(--s-danger)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export function LeadForm({
  inputs,
  cost,
  ret,
}: {
  inputs: ModelInputs
  cost: Scenario
  ret: ReturnModel
}) {
  const uid = useId()
  const [values, setValues] = useState<Enquiry>(EMPTY_ENQUIRY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [failure, setFailure] = useState('')

  const field = (key: keyof Enquiry) => ({
    value: values[key],
    error: errors[key],
    onChange: (v: string) => {
      setValues((prev) => ({ ...prev, [key]: v }))
      // Clear the error as soon as the reader starts fixing it.
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    },
  })

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById(`${uid}-name`)?.focus()
      return
    }

    setStatus('sending')
    try {
      await submitEnquiry(values, describeScenario(inputs, cost, ret))
      setStatus('sent')
    } catch (error) {
      setFailure(describeFailure(error))
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div
        className="p-10 text-center"
        style={{ background: 'var(--s-accent-soft)', borderRadius: 'var(--radius-lg)' }}
        role="status"
      >
        <h3 className="text-[clamp(1.4rem,3vw,1.9rem)]" style={{ color: 'var(--s-accent-text)' }}>
          Thank you, that is on its way.
        </h3>
        <p
          className="mx-auto mt-4 max-w-[36rem] text-[15.5px] leading-[1.6]"
          style={{ color: 'var(--s-muted)' }}
        >
          We have your details along with the scenario you had on screen, so the conversation can
          start from your own numbers rather than ours. Expect a reply within one business day.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="p-7 sm:p-10"
      style={{
        background: 'var(--s-surface-2)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--s-shadow)',
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id={`${uid}-name`} label="Your name" autoComplete="name" {...field('name')} />
        <Input
          id={`${uid}-email`}
          label="Work email"
          type="email"
          autoComplete="email"
          {...field('email')}
        />
        <Input
          id={`${uid}-company`}
          label="Company"
          autoComplete="organization"
          optional
          {...field('company')}
        />
        <Input
          id={`${uid}-phone`}
          label="Phone"
          type="tel"
          autoComplete="tel"
          optional
          {...field('phone')}
        />
        <Input
          id={`${uid}-message`}
          label="What are you trying to fix?"
          optional
          rows={4}
          {...field('message')}
        />
      </div>

      {/* Honeypot: a bot fills this, a person never sees it. */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
        style={{ left: '-9999px' }}
      />

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full px-7 py-3.5 text-[15.5px] font-semibold transition-transform duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
          style={{ background: 'var(--s-accent)', color: '#fff', boxShadow: 'var(--s-shadow)' }}
        >
          {status === 'sending' ? 'Sending…' : 'Book a walkthrough'}
        </button>

        <p
          className="max-w-[26rem] text-[12.5px] leading-[1.5]"
          style={{ color: 'var(--s-faint)' }}
        >
          Your current scenario — {inputs.headcount} people, {ret.scenario.name} case — is sent with
          the message so we can pick up where you left off.
        </p>
      </div>

      <div aria-live="polite">
        {status === 'error' && (
          <p
            className="mt-6 px-5 py-4 text-[13.5px] leading-[1.55]"
            style={{
              background: 'var(--s-notice-bg)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--s-text)',
            }}
          >
            That did not go through. {failure} You can email{' '}
            <a href={`mailto:${FALLBACK_EMAIL}`} style={{ color: 'var(--s-accent-text)' }}>
              {FALLBACK_EMAIL}
            </a>{' '}
            directly, or try again in a moment.
          </p>
        )}
      </div>
    </form>
  )
}
