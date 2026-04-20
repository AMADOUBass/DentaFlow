import twilio from 'twilio'

interface SendSMSProps {
  to: string
  message: string
}

export async function sendSMS({ to, message }: SendSMSProps) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER

  // If keys are missing, we mock the send
  if (
    !accountSid || accountSid.includes('xxxx') ||
    !authToken || authToken.includes('xxxx') ||
    !twilioNumber || twilioNumber.includes('14385551234')
  ) {
    console.log('--- SMS MOCK ---')
    console.log(`To: ${to}`)
    console.log(`Message: ${message}`)
    return { success: true, mock: true }
  }

  try {
    const client = twilio(accountSid, authToken)
    
    const response = await client.messages.create({
      body: message,
      from: twilioNumber,
      to: to
    })

    console.log(`[SMS] Message envoyé à ${to}: ${response.sid}`)
    return { success: true, sid: response.sid }
  } catch (error) {
    console.error('[SMS ERROR]', error)
    return { success: false, error }
  }
}
