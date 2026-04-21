import { PrismaClient, PlanTier, UserRole, ServiceCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // 1. Clear existing data
  await prisma.$transaction([
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
      name: 'Centre Dentaire Démo',
      email: 'demo@dentaflow.ca',
      phone: '514-555-0000',
      address: '123 Avenue de la Santé',
      city: 'Québec',
      postalCode: 'G1R 1A1',
      primaryColor: '#0F766E', // Teal 700
      planTier: PlanTier.COMPLET,
      businessHours: {
        create: [
          { weekday: 1, openTime: '08:00', closeTime: '17:00' },
          { weekday: 2, openTime: '08:00', closeTime: '17:00' },
          { weekday: 3, openTime: '08:00', closeTime: '17:00' },
          { weekday: 4, openTime: '08:00', closeTime: '17:00' },
          { weekday: 5, openTime: '08:00', closeTime: '16:00' },
        ]
      }
    }
  })

  // 3. Create Practitioners
  const dante = await prisma.practitioner.create({
    data: {
      tenantId: tenant.id,
      firstName: 'Dante',
      lastName: 'Alighieri',
      title: 'Dr',
      specialty: 'Dentiste généraliste',
      color: '#0EA5E9', // Blue 500
      schedules: {
        create: [
          { weekday: 1, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
          { weekday: 3, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
          { weekday: 5, startTime: '08:00', endTime: '16:00', lunchStart: '12:00', lunchEnd: '13:00' },
        ]
      }
    }
  })

  const beatrice = await prisma.practitioner.create({
    data: {
      tenantId: tenant.id,
      firstName: 'Beatrice',
      lastName: 'Portinari',
      title: 'Dre',
      specialty: 'Orthodontiste',
      color: '#EC4899', // Pink 500
      schedules: {
        create: [
          { weekday: 2, startTime: '09:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
          { weekday: 4, startTime: '09:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
        ]
      }
    }
  })

  // 4. Create Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Examen + Nettoyage',
        nameEn: 'Exam + Cleaning',
        durationMin: 60,
        priceCents: 15000,
        category: ServiceCategory.PREVENTION,
        practitioners: { create: [{ practitionerId: dante.id }] }
      }
    }),
    prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Plombage (Composite)',
        nameEn: 'Filling (Composite)',
        durationMin: 45,
        priceCents: 20000,
        category: ServiceCategory.RESTORATION,
        practitioners: { create: [{ practitionerId: dante.id }] }
      }
    }),
    prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Consultation Orthodontie',
        nameEn: 'Orthodontic Consultation',
        durationMin: 30,
        priceCents: 10000,
        category: ServiceCategory.ORTHODONTICS,
        practitioners: { create: [{ practitionerId: beatrice.id }] }
      }
    }),
    prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Blanchiment des dents',
        nameEn: 'Teeth Whitening',
        durationMin: 90,
        priceCents: 45000,
        category: ServiceCategory.ESTHETIC,
        practitioners: { create: [{ practitionerId: dante.id }] }
      }
    }),
    prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Urgence dentaire',
        nameEn: 'Emergency',
        durationMin: 45,
        priceCents: 15000,
        category: ServiceCategory.EMERGENCY,
        practitioners: { create: [{ practitionerId: dante.id }] }
      }
    }),
  ])

  // 5. Create a test user (Clinic Owner)
  await prisma.user.create({
    data: {
      authId: '739a11d7-e0ad-41f6-a0b7-7642652fb126',
      email: 'proprio@demo.ca',
      name: 'Proprio Démo',
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
