'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

import type { SiteSetting } from '@/payload-types'

type Announcement = NonNullable<SiteSetting['announcement']>

// Slim black announcement bar (consistent across all themes). Dismissible per session.
export function AnnouncementBar({ announcement }: { announcement?: Announcement | null }) {
  const [dismissed, setDismissed] = useState(false)

  if (!announcement?.enabled || !announcement.text || dismissed) return null

  return (
    <div className="relative flex min-h-[38px] items-center justify-center gap-3 bg-black px-10 py-1.5 text-center text-[13px] text-white/90">
      <span>{announcement.text}</span>
      {announcement.linkLabel && (
        <a
          href={announcement.linkHref || '#'}
          className="hidden border-b border-white/50 text-white transition-colors hover:border-white sm:inline"
        >
          {announcement.linkLabel}
        </a>
      )}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-4 text-white/50 transition-colors hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
