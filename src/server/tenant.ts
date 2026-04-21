'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { tenantSettingsSchema, type TenantSettingsInput } from '@/schemas/tenant'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

/**
 * Mise à jour des paramètres de la clinique (Tenant)
 */
export async function updateTenantAction(data: TenantSettingsInput) {
  const user = await getAdminUser()
  const tenantId = user.tenantId

  if (!tenantId) {
    throw new Error("Non autorisé ou aucun tenant trouvé")
  }

  // Validation
  const validated = tenantSettingsSchema.parse(data)

  try {
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        address: validated.address,
        city: validated.city,
        postalCode: validated.postalCode,
        province: validated.province,
        logoUrl: validated.logoUrl || null,
        primaryColor: validated.primaryColor,
        bilingual: validated.bilingual,
      }
    })
    
    // Log l'action dans le journal d'audit
    await logAudit({
      tenantId,
      userId: user.authId,
      action: 'UPDATE',
      category: 'SYSTEM',
      description: `Mise à jour des paramètres généraux de la clinique (Nom, Contact, Branding).`
    })

    // Revalider tout l'espace admin et public pour mettre à jour les métadonnées et le branding
    revalidatePath('/', 'layout')
    
    return { success: true, data: updatedTenant }
  } catch (error) {
    console.error('[UPDATE_TENANT_ERROR]', error)
    return { success: false, error: "Erreur lors de la mise à jour des paramètres." }
  }
}
