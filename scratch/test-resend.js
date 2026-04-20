import { sendEmail } from '../src/lib/email.js'
import dotenv from 'dotenv'

dotenv.config()

async function testEmail() {
  console.log('🚀 Tentative d\'envoi d\'email de test...')
  const result = await sendEmail({
    to: 'bassoumamadou0@gmail.com',
    subject: 'Hello World - DentaFlow Test',
    html: '<p>Congrats on sending your <strong>first email</strong> from DentaFlow!</p>'
  })

  if (result.success) {
    console.log('✅ Email envoyé avec succès !')
    console.log(result.data)
  } else {
    console.error('❌ Échec de l\'envoi.')
    console.error(result.error)
  }
}

testEmail()
