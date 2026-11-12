import { nodemailerAdapter, type NodemailerAdapterArgs } from '@payloadcms/email-nodemailer'

const singleEmail = /^[^\s@<>,;"\r\n]+@[^\s@<>,;"\r\n]+\.[^\s@<>,;"\r\n]+$/

/** Return only complete SMTP settings; never fall back to a test email account. */
export function getSMTPSettings(env: NodeJS.ProcessEnv = process.env) {
  const host = env.SMTP_HOST?.trim()
  const user = env.SMTP_USER?.trim()
  const pass = env.SMTP_PASS
  const fromAddress = env.EMAIL_FROM_ADDRESS?.trim() || user
  const recipient = env.CONTACT_NOTIFICATION_EMAIL?.trim() || 'codeboxstudios.official@gmail.com'
  const port = Number(env.SMTP_PORT?.trim() || '587')
  const secureValue = env.SMTP_SECURE?.trim().toLowerCase()

  if (
    !host ||
    !user ||
    !pass?.trim() ||
    !fromAddress ||
    !singleEmail.test(fromAddress) ||
    !singleEmail.test(recipient) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    (secureValue && secureValue !== 'true' && secureValue !== 'false')
  ) {
    return undefined
  }

  const secure = secureValue ? secureValue === 'true' : port === 465
  const adapterOptions: NodemailerAdapterArgs = {
    defaultFromAddress: fromAddress,
    defaultFromName: (env.EMAIL_FROM_NAME?.trim() || 'Code Box Studios').replace(/[\r\n]/g, ' '),
    // Verification during config import would contact SMTP during builds and log raw transport errors.
    skipVerify: true,
    transportOptions: {
      host,
      port,
      secure,
      requireTLS: !secure,
      auth: { user, pass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      dnsTimeout: 5000,
      logger: false,
      debug: false,
    },
  }

  return { adapterOptions, recipient }
}

export function getEmailAdapter() {
  const settings = getSMTPSettings()
  return settings ? nodemailerAdapter(settings.adapterOptions) : undefined
}
