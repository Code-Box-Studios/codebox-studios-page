'use server'

import { getPayloadClient } from '@/lib/data'

export type FormState = { ok: boolean; message: string } | null

const str = (value: FormDataEntryValue | null): string =>
  typeof value === 'string' ? value.trim() : ''

const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

// Contact form → ContactSubmissions collection.
export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = str(formData.get('name'))
  const email = str(formData.get('email'))
  const company = str(formData.get('company'))
  const budget = str(formData.get('budget'))
  const details = str(formData.get('details'))

  if (!name || !email || !isEmail(email)) {
    return { ok: false, message: 'Please add your name and a valid email address.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-submissions',
      data: { name, email, company: company || undefined, budget: budget || undefined, details: details || undefined },
    })
    return { ok: true, message: "Thanks — we'll get back to you within two business days." }
  } catch (err) {
    console.error('submitContact failed:', err)
    return { ok: false, message: 'Something went wrong sending your message. Please try again.' }
  }
}

// Newsletter footer → Subscribers collection.
export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = str(formData.get('email'))

  if (!isEmail(email)) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({ collection: 'subscribers', data: { email, source: 'footer' } })
    return { ok: true, message: "You're on the list." }
  } catch (err) {
    console.error('subscribe failed:', err)
    return { ok: false, message: 'Something went wrong. Please try again.' }
  }
}
