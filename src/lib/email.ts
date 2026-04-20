import { Resend } from 'resend'

// We initialize lazily to avoid crashes if the key is missing at load time (e.g. during build)
let resend: Resend | null = null

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey.includes('xxxx')) return null
    resend = new Resend(apiKey)
  }
  return resend
}

interface SendEmailProps {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailProps) {
  const client = getResendClient()

  if (!client) {
    console.log('--- EMAIL MOCK ---')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`HTML: ${html.substring(0, 100)}...`)
    return { success: true, mock: true }
  }

  try {
    const { data, error } = await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [to],
      subject,
      html,
    })

    if (error) {
       console.error('Error sending email:', error)
       return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service crash:', error)
    return { success: false, error }
  }
}
