'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

/**
 * Vérifie si le tenant de l'utilisateur connecté est Premium.
 */
async function checkPremiumAccess() {
  const user = await getAdminUser()
  const tenantId = user.tenantId
  if (!tenantId) throw new Error("Tenant non défini.")

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { planTier: true }
  })

  if (tenant?.planTier !== 'PREMIUM') {
    throw new Error("Le plan Premium (899$/mois) est requis pour accéder aux fonctionnalités d'API et d'intégrations.")
  }

  return { user, tenantId }
}

/**
 * Génère une nouvelle clé API pour la clinique.
 * Stocke le hash SHA-256 en base de données, et retourne la clé brute (affichée UNE SEULE FOIS).
 */
export async function generateApiKey(name: string) {
  const { tenantId, user } = await checkPremiumAccess()

  if (!name.trim()) {
    throw new Error("Le nom de la clé API est requis.")
  }

  // Génération d'une clé sécurisée préfixée
  const rawKey = `oros_live_${crypto.randomBytes(24).toString('hex')}`
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex')
  const last4 = rawKey.slice(-4)

  const apiKey = await prisma.apiKey.create({
    data: {
      tenantId,
      name: name.trim(),
      keyHash,
      last4
    }
  })

  // Audit
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: 'CREATE',
      category: 'SECURITY',
      description: `Génération de la clé API: "${name.trim()}" (terminant par ...${last4})`
    }
  })

  revalidatePath('/admin-area/admin/settings/integrations')
  
  return {
    id: apiKey.id,
    name: apiKey.name,
    rawKey, // À afficher à l'utilisateur
    last4,
    createdAt: apiKey.createdAt
  }
}

/**
 * Récupère toutes les clés API actives de la clinique.
 */
export async function getApiKeys() {
  const { tenantId } = await checkPremiumAccess()

  const keys = await prisma.apiKey.findMany({
    where: {
      tenantId,
      revokedAt: null
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return keys
}

/**
 * Révoque (supprime l'accès) d'une clé API.
 */
export async function revokeApiKey(id: string) {
  const { tenantId, user } = await checkPremiumAccess()

  const key = await prisma.apiKey.findFirst({
    where: { id, tenantId }
  })

  if (!key) {
    throw new Error("Clé API introuvable.")
  }

  await prisma.apiKey.update({
    where: { id },
    data: { revokedAt: new Date() }
  })

  // Audit
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: 'DELETE',
      category: 'SECURITY',
      description: `Révocation de la clé API: "${key.name}" (...${key.last4})`
    }
  })

  revalidatePath('/admin-area/admin/settings/integrations')
}

/**
 * Récupère les configurations Webhooks actives.
 */
export async function getWebhookEndpoints() {
  const { tenantId } = await checkPremiumAccess()

  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  })

  return endpoints
}

/**
 * Enregistre un nouvel endpoint Webhook.
 */
export async function createWebhookEndpoint(data: { url: string; events: string[] }) {
  const { tenantId, user } = await checkPremiumAccess()

  if (!data.url.startsWith('http://') && !data.url.startsWith('https://')) {
    throw new Error("L'URL du Webhook doit commencer par http:// ou https://")
  }

  if (!data.events || data.events.length === 0) {
    throw new Error("Vous devez sélectionner au moins un événement à écouter.")
  }

  // Clé secrète de signature
  const secret = `whsec_${crypto.randomBytes(16).toString('hex')}`

  const endpoint = await prisma.webhookEndpoint.create({
    data: {
      tenantId,
      url: data.url.trim(),
      secret,
      events: data.events,
      isActive: true
    }
  })

  // Audit
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: 'CREATE',
      category: 'SECURITY',
      description: `Ajout d'un point de terminaison Webhook pour l'URL: ${data.url.trim()}`
    }
  })

  revalidatePath('/admin-area/admin/settings/integrations')
  return endpoint
}

/**
 * Supprime un point de terminaison Webhook.
 */
export async function deleteWebhookEndpoint(id: string) {
  const { tenantId, user } = await checkPremiumAccess()

  const endpoint = await prisma.webhookEndpoint.findFirst({
    where: { id, tenantId }
  })

  if (!endpoint) {
    throw new Error("Webhook introuvable.")
  }

  await prisma.webhookEndpoint.delete({
    where: { id }
  })

  // Audit
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: 'DELETE',
      category: 'SECURITY',
      description: `Suppression du Webhook pour l'URL: ${endpoint.url}`
    }
  })

  revalidatePath('/admin-area/admin/settings/integrations')
}
