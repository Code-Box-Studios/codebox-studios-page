import type { GlobalConfig } from 'payload'

import { DEFAULT_THEME, THEME_OPTIONS } from '@/lib/theme'

// Site-wide chrome and the active visual theme. One editing surface for the
// pieces that wrap every section: announcement bar, header, footer, brand.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Configuration',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand & Theme',
          fields: [
            {
              name: 'theme',
              type: 'select',
              required: true,
              defaultValue: DEFAULT_THEME,
              options: THEME_OPTIONS,
              admin: {
                description:
                  'Legacy visual direction for the original theme previews (?theme=editorial, command, or stone). The homepage uses the new studio design.',
              },
            },
            {
              name: 'brandName',
              type: 'text',
              required: true,
              defaultValue: 'Code Box Studios',
              admin: { description: 'Rendered as "Code Box" + a muted "Studios".' },
            },
          ],
        },
        {
          label: 'Announcement',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'text', type: 'text' },
                { name: 'linkLabel', type: 'text' },
                { name: 'linkHref', type: 'text', defaultValue: '#contact' },
              ],
            },
          ],
        },
        {
          label: 'Header',
          fields: [
            {
              name: 'nav',
              type: 'array',
              labels: { singular: 'Link', plural: 'Links' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'signInLabel', type: 'text', defaultValue: 'Sign in' },
                { name: 'signInHref', type: 'text', defaultValue: '#' },
                { name: 'ctaLabel', type: 'text', defaultValue: 'Start a project' },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footer',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', defaultValue: 'Ship faster' },
                { name: 'heading', type: 'text' },
                {
                  name: 'newsletterPlaceholder',
                  type: 'text',
                  defaultValue: 'you@company.com',
                },
                {
                  name: 'columns',
                  type: 'array',
                  labels: { singular: 'Column', plural: 'Columns' },
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    {
                      name: 'links',
                      type: 'array',
                      fields: [
                        { name: 'label', type: 'text', required: true },
                        { name: 'href', type: 'text', defaultValue: '#' },
                      ],
                    },
                  ],
                },
                { name: 'copyright', type: 'text', defaultValue: '© 2026 Code Box Studios' },
                { name: 'location', type: 'text', defaultValue: 'Malta' },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
                { name: 'ogImage', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
