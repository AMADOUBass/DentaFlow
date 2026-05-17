import webpush from 'web-push'

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY ?? ''
const VAPID_EMAIL = process.env.VAPID_EMAIL ?? 'support@oros.ca'

let configured = false

function setupVapid() {
  if (configured || !VAPID_PUBLIC || !VAPID_PRIVATE) return
  webpush.setVapidDetails(`mailto:${VAPID_EMAIL}`, VAPID_PUBLIC, VAPID_PRIVATE)
  configured = true
}

export interface PushPayload {
  title: string
  body: string
  icon?: string
  url?: string
}

export async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload
): Promise<boolean> {
  setupVapid()
  if (!configured) return false

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth }
      },
      JSON.stringify(payload),
      { TTL: 86400 }
    )
    return true
  } catch (err: any) {
    // 410 Gone = subscription expired/unsubscribed
    if (err.statusCode === 410) return false
    console.error('[Push] Error:', err.message)
    return false
  }
}
