import type { CollectionConfig } from 'payload'

// Newsletter / "ship faster" email captures from the footer.
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
    group: 'Inbox',
  },
  fields: [
    { name: 'email', type: 'email', required: true },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'Where the signup came from (e.g. footer).' },
    },
  ],
}
