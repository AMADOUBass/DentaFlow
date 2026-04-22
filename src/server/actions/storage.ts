'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

/**
 * Ensures the 'patient-media' bucket exists with proper settings.
 */
export async function initStorageBucket() {
  const adminClient = createAdminClient()
  
  // We check if bucket exists
  const { data: buckets, error: listError } = await adminClient.storage.listBuckets()
  
  if (listError) {
    console.error('Error listing buckets:', listError)
    return { success: false, error: listError.message }
  }

  const exists = buckets.some(b => b.name === 'patient-media')
  
  if (!exists) {
    const { error: createError } = await adminClient.storage.createBucket('patient-media', {
      public: false, // Private bucket (Loi 25)
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
    })

    if (createError) {
      console.error('Error creating bucket:', createError)
      return { success: false, error: createError.message }
    }
  }

  return { success: true }
}

/**
 * Generates a signed URL for a file
 */
export async function getMediaUrl(path: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.storage
    .from('patient-media')
    .createSignedUrl(path, 3600) // 1 hour expiry

  if (error) {
    console.error('Error generating signed URL:', error)
    return null
  }

  return data.signedUrl
}

/**
 * Saves a media record in the database after successful upload
 */
export async function saveMediaRecord(data: {
  patientId: string
  name: string
  storagePath: string
  fileType: string
  category: string
  notes?: string
}) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const record = await (prisma as any).patientMedia.create({
    data: {
      tenantId,
      patientId: data.patientId,
      practitionerId: user.id,
      name: data.name,
      url: data.storagePath, // We store the path, generate signed URL on demand
      storagePath: data.storagePath,
      fileType: data.fileType,
      category: data.category,
      notes: data.notes
    }
  })

  revalidatePath(`/admin-area/admin/patients/${data.patientId}`)
  return { success: true, record }
}

/**
 * Deletes a media file from storage and database
 */
export async function deleteMedia(id: string, storagePath: string, patientId: string) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!
  const supabase = await createClient()

  // 1. Delete from Storage
  const { error: storageError } = await supabase.storage
    .from('patient-media')
    .remove([storagePath])

  if (storageError) {
    console.error('Error deleting from storage:', storageError)
    // We continue to delete from DB even if cloud file is gone
  }

  // 2. Delete from DB
  await (prisma as any).patientMedia.deleteMany({
    where: {
      id,
      tenantId // Isolation
    }
  })

  revalidatePath(`/admin-area/admin/patients/${patientId}`)
  return { success: true }
}
