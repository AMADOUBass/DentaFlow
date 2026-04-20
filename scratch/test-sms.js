import { sendSMS } from '../src/lib/sms.js'
import dotenv from 'dotenv'

dotenv.config()

async function testSMS() {
  console.log('🚀 Tentative d\'envoi de SMS via Twilio...')
  
  // NOTE: En mode Trial Twilio, vous ne pouvez envoyer qu'à des numéros vérifiés.
  // Je teste vers le numéro fourni par le client.
  const result = await sendSMS({
    to: '+15144368541', // J'utilise un numéro québécois typique pour le test
    message: 'DentaFlow: Felicitations ! Votre systeme de rappel SMS est maintenant operationnel. 🦷'
  })

  if (result.success) {
    console.log('✅ SMS envoyé avec succès !')
    console.log(`SID: ${result.sid}`)
  } else {
    console.error('❌ Échec de l\'envoi SMS.')
    console.error(result.error)
  }
}

testSMS()
