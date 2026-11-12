import type { CollectionConfig } from 'payload'
import { notifyContactSubmission } from '../lib/contact-notification'

// Inbound "Start a project" inquiries captured from the contact form.
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Inquiry',
    plural: 'Inquiries',
  },
  access: {
    // Anyone can submit the public contact form.
    create: () => true,
    // Only authenticated admins can read/manage submissions.
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'company', 'budget', 'createdAt'],
    group: 'Inbox',
  },
  hooks: {
    afterChange: [notifyContactSubmission],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'company', type: 'text' },
        { name: 'budget', type: 'text' },
      ],
    },
    {
      name: 'details',
      type: 'textarea',
      label: 'Project details',
    },
  ],
}
