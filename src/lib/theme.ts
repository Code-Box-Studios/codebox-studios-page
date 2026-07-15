// Single source of truth for the three switchable visual directions.
// Used by Payload (the theme <select>) and the frontend (variant dispatch + data-theme).

export const THEMES = ['editorial', 'command', 'stone'] as const

export type Theme = (typeof THEMES)[number]

export const DEFAULT_THEME: Theme = 'stone'

// Human-readable labels for the Payload admin select.
export const THEME_OPTIONS: { label: string; value: Theme }[] = [
  { label: 'Editorial White — austere light canvas, monumental type', value: 'editorial' },
  { label: 'Command — deep green / navy bands, code console, high contrast', value: 'command' },
  { label: 'Modular Stone — warm stone surfaces, navy accents, building-block grid', value: 'stone' },
]

// Narrow an arbitrary string to a valid Theme, falling back to the default.
export function resolveTheme(value: unknown): Theme {
  return THEMES.includes(value as Theme) ? (value as Theme) : DEFAULT_THEME
}
