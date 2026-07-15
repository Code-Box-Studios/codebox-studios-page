import type { Media } from '@/payload-types'

// A Payload upload field is either a populated Media doc (depth >= 1),
// an id (depth 0), or null. Narrow to the populated doc.
export function asMedia(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' ? value : null
}

export function mediaUrl(value: number | Media | null | undefined): string | null {
  return asMedia(value)?.url ?? null
}
