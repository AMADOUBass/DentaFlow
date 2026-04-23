import { PrismaClient, PlanTier, UserRole, ServiceCategory, AppointmentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // 1. Clear existing data
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.emergencyRequest.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.servicePractitioner.deleteMany(),
    prisma.service.deleteMany(),
    prisma.practitionerSchedule.deleteMany(),
    prisma.practitioner.deleteMany(),
    prisma.businessHours.deleteMany(),
    prisma.user.deleteMany(),
    prisma.tenant.deleteMany(),
  ])

  // 2. Create Demo Tenant
  const tenant = await prisma.tenant.create({
    data: {
      slug: 'demo',
      name: 'Centre Dentaire Oros (Démo)',
      email: 'contact@oros.homes',
      phone: '514-555-0123',
      address: '1230 Rue Sherbrooke Ouest',
      city: 'Montréal',
      postalCode: 'H3G 1H6',
      primaryColor: '#0F172A',
      planTier: PlanTier.COMPLET,
      isActive: true,
      isValidated: true,
      neq: '1234567890',
      businessHours: {
        create: [
          { weekday: 1, openTime: '08:00', closeTime: '18:00' },
          { weekday: 2, openTime: '08:00', closeTime: '18:00' },
          { weekday: 3, openTime: '08:00', closeTime: '18:00' },
          { weekday: 4, openTime: '08:00', closeTime: '20:00' },
          { weekday: 5, openTime: '08:00', closeTime: '16:00' },
        ]
      }
    }
  })

  // 3. Create Practitioners
  // Dr. Dante (Généraliste) - Lundi, Mercredi, Vendredi
  const dante = await prisma.practitioner.create({
    data: {
      tenantId: tenant.id,
      firstName: 'Dante',
      lastName: 'Alighieri',
      title: 'Dr',
      specialty: 'Dentiste généraliste',
      color: '#0EA5E9',
      schedules: {
        create: [
          { weekday: 1, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
          { weekday: 3, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
          { weekday: 5, startTime: '08:00', endTime: '16:00', lunchStart: '12:00', lunchEnd: '13:00' },
        ]
      }
    }
  })

  // Dre. Beatrice (Orthodontiste) - PLEIN TEMPS pour tes tests
  const beatrice = await prisma.practitioner.create({
    data: {
      tenantId: tenant.id,
      firstName: 'Beatrice',
      lastName: 'Portinari',
      title: 'Dre',
      specialty: 'Orthodontiste Spécialisée',
      color: '#EC4899',
      schedules: {
        create: [
          { weekday: 1, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
          { weekday: 2, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
          { weekday: 3, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
          { weekday: 4, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
          { weekday: 5, startTime: '08:00', endTime: '16:00', lunchStart: '12:00', lunchEnd: '13:00' },
        ]
      }
    }
  })

  // 4. Create Services
  const orthoConsult = await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: 'Consultation Orthodontie',
      nameEn: 'Orthodontic Consultation',
      durationMin: 30,
      priceCents: 10000,
      category: ServiceCategory.ORTHODONTICS,
      practitioners: { create: [{ practitionerId: beatrice.id }] }
    }
  })

  const orthoSuivi = await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: 'Suivi Orthodontique',
      nameEn: 'Orthodontic Follow-up',
      durationMin: 45,
      priceCents: 15000,
      category: ServiceCategory.ORTHODONTICS,
      practitioners: { create: [{ practitionerId: beatrice.id }] }
    }
  })

  await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: 'Examen + Nettoyage',
      nameEn: 'Exam + Cleaning',
      durationMin: 60,
      priceCents: 15000,
      category: ServiceCategory.PREVENTION,
      practitioners: { create: [{ practitionerId: dante.id }] }
    }
  })

  // 5. Create Users
  // Super Admin
  await prisma.user.create({
    data: {
      authId: 'superadmin-auth-id',
      email: 'superadmin@oros.homes',
      name: 'Super Admin Oros',
      role: UserRole.SUPERADMIN,
    }
  })

  // Proprio de la clinique démo
  await prisma.user.create({
    data: {
      authId: '739a11d7-e0ad-41f6-a0b7-7642652fb126',
      email: 'proprio@demo.ca',
      name: 'Dr. Dante (Proprio)',
      role: UserRole.CLINIC_OWNER,
      tenantId: tenant.id
    }
  })

  console.log('✅ Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
