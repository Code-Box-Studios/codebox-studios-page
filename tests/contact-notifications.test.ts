import assert from 'node:assert/strict'
import { after, beforeEach, test } from 'node:test'
import type { CollectionAfterChangeHook, SendEmailOptions } from 'payload'
import { ContactSubmissions } from '../src/collections/ContactSubmissions'
import { getEmailAdapter, getSMTPSettings } from '../src/lib/email'
import type { ContactSubmission } from '../src/payload-types'

const mailEnvKeys = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'EMAIL_FROM_ADDRESS',
  'EMAIL_FROM_NAME',
  'CONTACT_NOTIFICATION_EMAIL',
] as const
const originalEnv = Object.fromEntries(mailEnvKeys.map((key) => [key, process.env[key]]))

beforeEach(() => {
  for (const key of mailEnvKeys) delete process.env[key]
})

after(() => {
  for (const key of mailEnvKeys) {
    const value = originalEnv[key]
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
})

function configureSMTP() {
  process.env.SMTP_HOST = 'smtp.example.test'
  process.env.SMTP_USER = 'sender@example.test'
  process.env.SMTP_PASS = 'test-password'
}

const inquiry: ContactSubmission = {
  id: 42,
  name: 'Test Visitor',
  email: 'visitor@example.test',
  company: 'Example Company',
  budget: 'PHP 100,000–250,000',
  details: 'Please build our scheduling app.\nWe have three branches.',
  createdAt: '2026-11-12T09:00:00.000Z',
  updatedAt: '2026-11-12T09:00:00.000Z',
}

async function runHook({
  operation = 'create',
  adapterName = 'nodemailer',
  sendEmail = async () => ({ accepted: ['codeboxstudios.official@gmail.com'], rejected: [] }),
}: {
  operation?: 'create' | 'update'
  adapterName?: string
  sendEmail?: (message: SendEmailOptions) => Promise<unknown>
} = {}) {
  const hook = ContactSubmissions.hooks?.afterChange?.[0]
  assert.equal(typeof hook, 'function', 'new inquiries must run the notification hook')
  const warnings: unknown[] = []
  const args = {
    doc: inquiry,
    data: inquiry,
    operation,
    previousDoc: inquiry,
    context: {},
    collection: ContactSubmissions,
    req: {
      payload: {
        email: { name: adapterName },
        sendEmail,
        logger: { warn: (...values: unknown[]) => warnings.push(values) },
      },
    },
  } as unknown as Parameters<CollectionAfterChangeHook<ContactSubmission>>[0]
  const result = await hook!(args)
  return { result, warnings }
}

test('new inquiries notify the company inbox with the visitor as Reply-To', async () => {
  configureSMTP()
  const emails: SendEmailOptions[] = []
  const { result, warnings } = await runHook({
    sendEmail: async (message) => {
      emails.push(message)
      return { accepted: ['codeboxstudios.official@gmail.com'], rejected: [] }
    },
  })

  assert.equal(result, inquiry)
  assert.equal(warnings.length, 0)
  assert.equal(emails.length, 1)
  assert.equal(emails[0].to, 'codeboxstudios.official@gmail.com')
  assert.equal(emails[0].replyTo, 'visitor@example.test')
  assert.equal(emails[0].html, undefined)
  const text = String(emails[0].text)
  for (const value of ['42', inquiry.name, inquiry.email, inquiry.company!, inquiry.budget!, inquiry.details!]) {
    assert.ok(text.includes(String(value)), `notification must include ${value}`)
  }
})

test('recipient comes from server configuration, never visitor input', async () => {
  configureSMTP()
  process.env.CONTACT_NOTIFICATION_EMAIL = 'inquiries@example.test'
  const emails: SendEmailOptions[] = []
  await runHook({
    sendEmail: async (message) => {
      emails.push(message)
      return { accepted: ['inquiries@example.test'], rejected: [] }
    },
  })
  assert.equal(emails[0].to, 'inquiries@example.test')
})

test('editing a saved inquiry does not send another notification', async () => {
  configureSMTP()
  const { result, warnings } = await runHook({
    operation: 'update',
    sendEmail: async () => assert.fail('updates must not send email'),
  })
  assert.equal(result, inquiry)
  assert.equal(warnings.length, 0)
})

test('missing SMTP configuration skips the default logging mailer and preserves the inquiry', async () => {
  const { result, warnings } = await runHook({
    sendEmail: async () => assert.fail('unconfigured email must not be treated as delivery'),
  })
  assert.equal(result, inquiry)
  assert.equal(warnings.length, 1)
  assert.match(JSON.stringify(warnings), /not configured/i)
})

test('a logging adapter cannot count as delivery even when SMTP variables are set', async () => {
  configureSMTP()
  let sent = false
  const { result, warnings } = await runHook({
    adapterName: 'console',
    sendEmail: async () => {
      sent = true
      return undefined
    },
  })
  assert.equal(result, inquiry)
  assert.equal(sent, false)
  assert.equal(warnings.length, 1)
  assert.match(JSON.stringify(warnings), /not configured/i)
})

test('partial SMTP credentials preserve the inquiry without attempting delivery', async () => {
  configureSMTP()
  delete process.env.SMTP_PASS
  let sent = false
  const { result, warnings } = await runHook({
    sendEmail: async () => {
      sent = true
      return undefined
    },
  })
  assert.equal(result, inquiry)
  assert.equal(sent, false)
  assert.equal(warnings.length, 1)
})

test('a configured recipient list cannot turn inquiries into email to multiple recipients', async () => {
  configureSMTP()
  process.env.CONTACT_NOTIFICATION_EMAIL = 'owner@example.test,other@example.test'
  let sent = false
  const { result, warnings } = await runHook({
    sendEmail: async () => {
      sent = true
      return undefined
    },
  })
  assert.equal(result, inquiry)
  assert.equal(sent, false)
  assert.equal(warnings.length, 1)
})

test('unconfigured email never initializes an Ethereal test account', () => {
  assert.equal(getEmailAdapter(), undefined)
})

test('SMTP uses STARTTLS on 587 and implicit TLS on 465', () => {
  configureSMTP()
  const starttls = getSMTPSettings()!.adapterOptions.transportOptions!
  assert.equal(starttls.port, 587)
  assert.equal(starttls.secure, false)
  assert.equal(starttls.requireTLS, true)

  process.env.SMTP_PORT = '465'
  const tls = getSMTPSettings()!.adapterOptions.transportOptions!
  assert.equal(tls.port, 465)
  assert.equal(tls.secure, true)
})

test('SMTP failure preserves the inquiry and logs no visitor details or transport secrets', async () => {
  configureSMTP()
  const { result, warnings } = await runHook({
    sendEmail: async () => {
      throw new Error(`smtp auth failed: ${process.env.SMTP_PASS}; ${inquiry.email}; ${inquiry.details}`)
    },
  })
  assert.equal(result, inquiry)
  assert.equal(warnings.length, 1)
  const logged = JSON.stringify(warnings)
  assert.match(logged, /failed/i)
  for (const privateValue of [inquiry.name, inquiry.email, inquiry.details!, process.env.SMTP_PASS!]) {
    assert.ok(!logged.includes(privateValue))
  }
})
