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
  try {
    const user = await getAdminUser()
    const tenantId = user.tenantId

    if (!tenantId) {
      return { success: false, error: "Aucun tenant associé à ce compte." }
    }

    const parsed = tenantSettingsSchema.safeParse(data)
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return { success: false, error: first?.message ?? "Données invalides. Vérifiez les champs du formulaire." }
    }

    const validated = parsed.data

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

    await logAudit({
      tenantId,
      userId: user.authId,
      action: 'UPDATE',
      category: 'SYSTEM',
      description: `Mise à jour des paramètres généraux de la clinique (Nom, Contact, Branding).`
    })

    revalidatePath('/admin/settings', 'page')
    revalidatePath('/admin/dashboard', 'page')

    return { success: true, data: updatedTenant }
  } catch (error) {
    console.error('[UPDATE_TENANT_ERROR]', error)
    return { success: false, error: "Erreur lors de la mise à jour. Veuillez réessayer." }
  }
}
