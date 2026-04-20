'use server'

import { contactSchema, type ContactInput } from '@/schemas/contact'

export async function submitContactRequest(tenantId: string, data: ContactInput) {
  // Validate data
  const result = contactSchema.safeParse(data)
  
  if (!result.success) {
    return { success: false, error: "Données invalides" }
  }

  // In a real app, we might save this to a 'ContactRequest' table
  // or send an email to the clinic owner.
  // For now, we'll just simulate a successful submission.
  console.log(`[Contact] Request received for tenant ${tenantId}:`, result.data)

  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000))

  return { success: true }
}
