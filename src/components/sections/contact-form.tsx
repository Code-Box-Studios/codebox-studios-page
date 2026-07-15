'use client'

import { useActionState } from 'react'

import { submitContact } from '@/app/(frontend)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface ContactFormProps {
  submitLabel: string
  budgetOptions: string[]
}

export function ContactForm({ submitLabel, budgetOptions }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContact, null)

  if (state?.ok) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl bg-white p-10 text-center"
      >
        <div
          aria-hidden
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-2xl text-accent-text"
        >
          ✓
        </div>
        <p className="max-w-[280px] text-[17px] text-ink">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="rounded-2xl bg-white p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <Input id="name" name="name" required autoComplete="name" />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label="Company" htmlFor="company">
          <Input id="company" name="company" autoComplete="organization" />
        </Field>
        <Field label="Budget" htmlFor="budget">
          <Select name="budget">
            <SelectTrigger id="budget">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {budgetOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Project details" htmlFor="details">
          <Textarea id="details" name="details" rows={4} />
        </Field>
      </div>

      {state && !state.ok && (
        <p role="alert" className="mt-4 text-sm text-accent-text">
          {state.message}
        </p>
      )}

      <div className="mt-6">
        <Button type="submit" variant="primary" size="block" disabled={pending}>
          {pending ? 'Sending…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}
