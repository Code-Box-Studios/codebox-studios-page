import type { CollectionAfterChangeHook } from 'payload'
import type { ContactSubmission } from '../payload-types'
import { getSMTPSettings } from './email'

/** Email is best effort: a transport failure must not reject a saved inquiry. */
export const notifyContactSubmission: CollectionAfterChangeHook<ContactSubmission> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const settings = getSMTPSettings()
  if (!settings || req.payload.email.name !== 'nodemailer') {
    req.payload.logger.warn({ inquiryID: doc.id }, 'Inquiry email not configured; inquiry remains in the CMS.')
    return doc
  }

  try {
    await req.payload.sendEmail({
      to: settings.recipient,
      replyTo: doc.email,
      subject: 'New Code Box Studios project inquiry',
      text: [
        'A new project inquiry is available in the CMS.',
        '',
        `Inquiry: ${doc.id}`,
        `Received: ${doc.createdAt}`,
        `Name: ${doc.name}`,
        `Email: ${doc.email}`,
        `Company: ${doc.company || 'Not provided'}`,
        `Budget: ${doc.budget || 'Not provided'}`,
        '',
        'Project details:',
        doc.details || 'Not provided',
      ].join('\n'),
    })
  } catch {
    // SMTP errors can contain credentials, addresses, or message content. Do not log the error object.
    req.payload.logger.warn({ inquiryID: doc.id }, 'Inquiry email failed; inquiry remains in the CMS.')
  }

  return doc
}
