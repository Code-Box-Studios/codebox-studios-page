import type { GlobalConfig } from 'payload'

// Icon-glyph shapes used by the Capabilities cards (mirrors the design's
// little geometric marks). Rendered by the frontend into CSS shapes.
const shapeOptions = [
  { label: 'Square', value: 'square' },
  { label: 'Circle', value: 'circle' },
  { label: 'Diamond', value: 'diamond' },
  { label: 'Notched', value: 'notched' },
  { label: 'Teardrop', value: 'teardrop' },
  { label: 'Block', value: 'block' },
]

const eyebrow = { name: 'eyebrow', type: 'text' } as const
const heading = { name: 'heading', type: 'text' } as const

// The full landing-page content, theme-agnostic. Switching themes changes the
// visual treatment only — this content is rendered by all three directions.
export const LandingContent: GlobalConfig = {
  slug: 'landing-content',
  label: 'Landing Page',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                eyebrow,
                heading,
                { name: 'body', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Start a project' },
                    { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'See how we work' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Trust',
          fields: [
            {
              name: 'trust',
              type: 'group',
              fields: [
                eyebrow,
                {
                  name: 'logos',
                  type: 'array',
                  labels: { singular: 'Logo', plural: 'Logos' },
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'image', type: 'upload', relationTo: 'media' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Services',
          fields: [
            {
              name: 'services',
              type: 'group',
              fields: [
                eyebrow,
                heading,
                { name: 'intro', type: 'textarea' },
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Service', plural: 'Services' },
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Capabilities',
          fields: [
            {
              name: 'capabilities',
              type: 'group',
              fields: [
                eyebrow,
                heading,
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Capability', plural: 'Capabilities' },
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea', required: true },
                    {
                      name: 'shape',
                      type: 'select',
                      defaultValue: 'square',
                      options: shapeOptions,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Process',
          fields: [
            {
              name: 'process',
              type: 'group',
              fields: [
                eyebrow,
                heading,
                {
                  name: 'steps',
                  type: 'array',
                  labels: { singular: 'Step', plural: 'Steps' },
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Portfolio',
          fields: [
            {
              name: 'portfolio',
              type: 'group',
              fields: [
                eyebrow,
                heading,
                { name: 'allLabel', type: 'text', defaultValue: 'All work' },
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Project', plural: 'Projects' },
                  fields: [
                    { name: 'tag', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                    { name: 'note', type: 'text' },
                    { name: 'image', type: 'upload', relationTo: 'media' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Engagement',
          fields: [
            {
              name: 'engagement',
              type: 'group',
              fields: [
                eyebrow,
                heading,
                {
                  name: 'plans',
                  type: 'array',
                  labels: { singular: 'Plan', plural: 'Plans' },
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'description', type: 'textarea', required: true },
                    {
                      name: 'features',
                      type: 'array',
                      fields: [{ name: 'feature', type: 'text', required: true }],
                    },
                    { name: 'ctaLabel', type: 'text', required: true },
                    {
                      name: 'popular',
                      type: 'checkbox',
                      admin: { description: 'Highlights this plan as the featured option.' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'About',
          fields: [
            {
              name: 'about',
              type: 'group',
              fields: [
                eyebrow,
                heading,
                { name: 'body', type: 'textarea' },
                {
                  name: 'stats',
                  type: 'array',
                  labels: { singular: 'Stat', plural: 'Stats' },
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    { name: 'note', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Testimonials',
          fields: [
            {
              name: 'testimonials',
              type: 'group',
              fields: [
                eyebrow,
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Testimonial', plural: 'Testimonials' },
                  fields: [
                    { name: 'quote', type: 'textarea', required: true },
                    { name: 'name', type: 'text', required: true },
                    { name: 'role', type: 'text', required: true },
                    { name: 'avatar', type: 'upload', relationTo: 'media' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faq',
              type: 'group',
              fields: [
                eyebrow,
                heading,
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Question', plural: 'Questions' },
                  fields: [
                    { name: 'question', type: 'text', required: true },
                    { name: 'answer', type: 'textarea', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                eyebrow,
                heading,
                { name: 'body', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'email', type: 'text', defaultValue: 'codeboxstudios.official@gmail.com' },
                    { name: 'locationNote', type: 'text', defaultValue: 'Tagum, Davao · Remote-friendly' },
                  ],
                },
                { name: 'submitLabel', type: 'text', defaultValue: 'Send inquiry' },
                {
                  name: 'budgetOptions',
                  type: 'array',
                  labels: { singular: 'Budget option', plural: 'Budget options' },
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
