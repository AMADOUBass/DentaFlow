import { PrismaClient, UserRole, AppointmentStatus, EmergencyCategory } from '@prisma/client'
import { addDays, subDays, startOfToday, setHours, setMinutes } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed Phase 3...')

  // 1. Get the demo tenant
  const tenant = await prisma.tenant.findUnique({ where: { slug: 'demo' } })
  if (!tenant) {
    console.error('❌ Tenant "demo" non trouvé. Lancez d\'abord le seed de base.')
    return
  }

  const tenantId = tenant.id

  // 2. Clear existing dynamic data (optional, but cleaner for demo)
  // await prisma.appointment.deleteMany({ where: { tenantId } })
  // await prisma.patient.deleteMany({ where: { tenantId } })

  // 3. Create some Patients
  const patients = await Promise.all([
    prisma.patient.upsert({
      where: { tenantId_email: { tenantId, email: 'jean.tremblay@email.com' } },
      update: {},
      create: {
        tenantId,
        firstName: 'Jean',
        lastName: 'Tremblay',
        email: 'jean.tremblay@email.com',
        phone: '514-555-0101',
      }
    }),
    prisma.patient.upsert({
      where: { tenantId_email: { tenantId, email: 'marie.gagnon@email.com' } },
      update: {},
      create: {
        tenantId,
        firstName: 'Marie',
        lastName: 'Gagnon',
        email: 'marie.gagnon@email.com',
        phone: '514-555-0102',
      }
    }),
    prisma.patient.upsert({
      where: { tenantId_email: { tenantId, email: 'luc.leclerc@email.com' } },
      update: {},
      create: {
        tenantId,
        firstName: 'Luc',
        lastName: 'Leclerc',
        email: 'luc.leclerc@email.com',
        phone: '514-555-0103',
      }
    })
  ])

  // 4. Get Practitioners and Services
  const practitioners = await prisma.practitioner.findMany({ where: { tenantId } })
  const services = await prisma.service.findMany({ where: { tenantId } })

  if (practitioners.length === 0 || services.length === 0) {
    console.error('❌ Praticiens ou Services manquants.')
    return
  }

  // 5. Create some Appointments (Today and Tomorrow)
  const today = startOfToday()
  
  await prisma.appointment.createMany({
    data: [
      {
        tenantId,
        patientId: patients[0].id,
        practitionerId: practitioners[0].id,
        serviceId: services[0].id,
        startsAt: setMinutes(setHours(today, 9), 0),
        endsAt: setMinutes(setHours(today, 10), 0),
        status: AppointmentStatus.CONFIRMED,
      },
      {
        tenantId,
        patientId: patients[1].id,
        practitionerId: practitioners[0].id,
        serviceId: services[1].id,
        startsAt: setMinutes(setHours(today, 14), 30),
        endsAt: setMinutes(setHours(today, 15), 30),
        status: AppointmentStatus.PENDING,
      },
      {
        tenantId,
        patientId: patients[2].id,
        practitionerId: practitioners[1].id,
        serviceId: services[0].id,
        startsAt: setMinutes(setHours(addDays(today, 1), 10), 0),
        endsAt: setMinutes(setHours(addDays(today, 1), 11), 0),
        status: AppointmentStatus.CONFIRMED,
      }
    ]
  })

  // 6. Create some Emergencies
  await prisma.emergencyRequest.create({
    data: {
      tenantId,
      firstName: 'Robert',
      lastName: 'Boucher',
      phone: '418-555-9999',
      painLevel: 9,
      category: EmergencyCategory.TRAUMA,
      description: 'Dent cassée en mangeant une pomme.',
      handled: false,
    }
  })

  console.log('✅ Seed Phase 3 terminé !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
