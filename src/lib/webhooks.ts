import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export type WebhookEvent = 
  | 'appointment.created' 
  | 'appointment.cancelled' 
  | 'patient.created' 
  | 'patient.updated'

/**
 * Déclenche un webhook de manière asynchrone (fire-and-forget)
 * pour notifier les systèmes tiers connectés à la clinique.
 */
export async function triggerWebhook(tenantId: string, event: WebhookEvent, data: any) {
  try {
    // 1. Récupérer les webhooks actifs de la clinique
    const endpoints = await prisma.webhookEndpoint.findMany({
      where: {
        tenantId,
        isActive: true
      }
    })

    if (endpoints.length === 0) return

    const payload = {
      id: `evt_${crypto.randomBytes(12).toString('hex')}`,
      event,
      createdAt: new Date().toISOString(),
      data
    }

    const jsonPayload = JSON.stringify(payload)

    // 2. Envoyer les requêtes en parallèle (sans bloquer le thread principal)
    endpoints.forEach(async (endpoint: any) => {
      // Vérifier si le webhook écoute cet événement
      const listenedEvents = endpoint.events as string[]
      if (!listenedEvents.includes(event)) return

      try {
        const timestamp = Math.floor(Date.now() / 1000)
        const signedPayload = `${timestamp}.${jsonPayload}`
        
        // Signature HMAC-SHA256 pour la sécurité de réception
        const signature = crypto
          .createHmac('sha256', endpoint.secret)
          .update(signedPayload)
          .digest('hex')

        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Oros-Webhook-Bot/1.0',
            'x-oros-signature': `t=${timestamp},v1=${signature}`
          },
          body: jsonPayload,
          signal: AbortSignal.timeout(5000) // Timeout de 5s pour éviter de suspendre
        })

        // Enregistrer une trace de succès/échec si nécessaire
        console.log(`[Webhook] Sent ${event} to ${endpoint.url} - Status: ${response.status}`)
      } catch (err: any) {
        console.error(`[Webhook Error] Failed to send ${event} to ${endpoint.url}:`, err.message)
      }
    })
  } catch (error) {
    console.error('[Webhook System Error] Failed to process webhook trigger:', error)
  }
}
