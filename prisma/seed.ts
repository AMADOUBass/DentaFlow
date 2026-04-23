import { PrismaClient, PlanTier, UserRole, ServiceCategory, AppointmentStatus } from '@prisma/client'
import { addDays, setHours, setMinutes, startOfDay } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding Oros Premium...')

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

  // 3. Create Practitioners with Avatars
  const dante = await prisma.practitioner.create({
    data: {
      tenantId: tenant.id,
      firstName: 'Dante',
      lastName: 'Alighieri',
      title: 'Dr',
      specialty: 'Dentiste généraliste',
      color: '#0EA5E9',
      photoUrl: '/demo/dr-dante.png',
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

  const beatrice = await prisma.practitioner.create({
    data: {
      tenantId: tenant.id,
      firstName: 'Beatrice',
      lastName: 'Portinari',
      title: 'Dre',
      specialty: 'Orthodontiste Spécialisée',
      color: '#EC4899',
      photoUrl: '/demo/dre-beatrice.png',
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
      description: 'Analyse complète de votre dentition avec scans 3D pour un alignement parfait.',
      imageUrl: '/demo/ortho-consult.png',
      durationMin: 30,
      priceCents: 10000,
      category: ServiceCategory.ORTHODONTICS,
      practitioners: { create: [{ practitionerId: beatrice.id }] }
    }
  })

  const examination = await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: 'Examen + Nettoyage',
      nameEn: 'Exam + Cleaning',
      description: 'Nettoyage professionnel et examen complet pour une santé buccale optimale.',
      imageUrl: '/demo/dental-exam.png',
      durationMin: 60,
      priceCents: 15000,
      category: ServiceCategory.PREVENTION,
      practitioners: { create: [{ practitionerId: dante.id }] }
    }
  })

  // 5. Create Sample Patient
  const patient = await prisma.patient.create({
    data: {
      tenantId: tenant.id,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@exemple.ca',
      phone: '514-555-9988',
      dateOfBirth: new Date('1985-05-15'),
    }
  })

  // 6. Create Sample Appointments
  const today = startOfDay(new Date())
  
  // Appointment for tomorrow
  await prisma.appointment.create({
    data: {
      tenantId: tenant.id,
      patientId: patient.id,
      practitionerId: beatrice.id,
      serviceId: orthoConsult.id,
      startsAt: setMinutes(setHours(addDays(today, 1), 10), 0),
      endsAt: setMinutes(setHours(addDays(today, 1), 10), 30),
      status: AppointmentStatus.CONFIRMED,
      notes: 'Premier rendez-vous de test.'
    }
  })

  // Appointment for next week
  await prisma.appointment.create({
    data: {
      tenantId: tenant.id,
      patientId: patient.id,
      practitionerId: dante.id,
      serviceId: examination.id,
      startsAt: setMinutes(setHours(addDays(today, 7), 14), 0),
      endsAt: setMinutes(setHours(addDays(today, 7), 15), 0),
      status: AppointmentStatus.CONFIRMED,
    }
  })

  // 7. Create Super Admin
  await prisma.user.create({
    data: {
      authId: 'superadmin-auth-id',
      email: 'superadmin@oros.homes',
      name: 'Super Admin Oros',
      role: UserRole.SUPERADMIN,
    }
  })

  console.log('✅ Oros Premium Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
