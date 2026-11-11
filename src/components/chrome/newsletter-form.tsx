'use client'

import { useActionState } from 'react'

import { subscribe } from '@/app/(frontend)/actions'

export function NewsletterForm({ placeholder }: { placeholder: string }) {
  const [state, formAction, pending] = useActionState(subscribe, null)

  return (
    <div className="max-w-[360px]">
      <form
        action={formAction}
        className="flex items-center gap-2 rounded-lg border border-white/20 py-1.5 pl-4 pr-1.5 focus-within:border-white/40"
      >
        <input
          type="email"
          name="email"
          required
          placeholder={placeholder}
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe"
          className="flex min-h-11 shrink-0 items-center justify-center rounded-md bg-white px-3 text-xs font-medium text-[#17171c] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {state && (
        <p
          role={state.ok ? 'status' : 'alert'}
          aria-live="polite"
          className={`mt-2 text-xs ${state.ok ? 'text-white/70' : 'text-accent'}`}
        >
          {state.message}
        </p>
      )}
    </div>
  )
}
