/**
 * seed-demo.ts — Seed non-destructif pour démonstration client.
 * Utilise upsert/findFirst pour ne jamais effacer de données existantes.
 * Lance avec: npx prisma db seed --schema=prisma/schema.prisma -- --demo
 * ou: npm run seed:demo
 */
import { PrismaClient, PlanTier, ServiceCategory, AppointmentStatus } from '@prisma/client'
import { addDays, addHours, setHours, setMinutes, startOfDay, subDays } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding demo data (non-destructive)...')

  // 1. Upsert tenant demo — update inclus pour appliquer les vraies infos client
  const clientInfo = {
    name: 'Centre Dentaire Sainte-Foy',
    email: 'info@centredentairestefoy.com',
    phone: '418-683-3368',
    address: '2145 chemin Sainte-Foy',
    city: 'Québec',
    postalCode: 'G1V 1S1',
    province: 'QC',
    primaryColor: '#0F172A',
  }

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: clientInfo,
    create: {
      slug: 'demo',
      ...clientInfo,
      planTier: PlanTier.COMPLET,
      isActive: true,
      isValidated: true,
      neq: '1234567890',
    },
  })

  // 2. Heures d'ouverture — toujours remise à jour avec les vraies heures client
  // Lundi=1, Mardi=2, Mercredi=3, Jeudi=4, Vendredi=5, Samedi=6, Dimanche=0
  await prisma.businessHours.deleteMany({ where: { tenantId: tenant.id } })
  await prisma.businessHours.createMany({
    data: [
      { tenantId: tenant.id, weekday: 1, openTime: '08:00', closeTime: '17:00' },
      { tenantId: tenant.id, weekday: 2, openTime: '08:00', closeTime: '20:00' },
      { tenantId: tenant.id, weekday: 3, openTime: '08:00', closeTime: '16:00' },
      { tenantId: tenant.id, weekday: 4, openTime: '08:00', closeTime: '16:00' },
      { tenantId: tenant.id, weekday: 5, openTime: '08:00', closeTime: '14:00' },
      // Samedi et Dimanche fermés — pas de ligne = fermé
    ],
  })

  // 3. Praticiens — findOrCreate par nom
  async function findOrCreatePractitioner(data: {
    firstName: string
    lastName: string
    title: string
    specialty: string
    color: string
    photoUrl: string
    schedules: { weekday: number; startTime: string; endTime: string; lunchStart?: string; lunchEnd?: string }[]
  }) {
    const existing = await prisma.practitioner.findFirst({
      where: { tenantId: tenant.id, firstName: data.firstName, lastName: data.lastName },
    })
    if (existing) return existing
    return prisma.practitioner.create({
      data: {
        tenantId: tenant.id,
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        specialty: data.specialty,
        color: data.color,
        photoUrl: data.photoUrl,
        schedules: { create: data.schedules },
      },
    })
  }

  const dante = await findOrCreatePractitioner({
    firstName: 'Dante', lastName: 'Alighieri', title: 'Dr',
    specialty: 'Dentiste généraliste', color: '#0EA5E9', photoUrl: '/demo/dr-dante.png',
    schedules: [
      { weekday: 1, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      { weekday: 2, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      { weekday: 3, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      { weekday: 4, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      { weekday: 5, startTime: '08:00', endTime: '16:00', lunchStart: '12:00', lunchEnd: '13:00' },
    ],
  })

  const beatrice = await findOrCreatePractitioner({
    firstName: 'Beatrice', lastName: 'Portinari', title: 'Dre',
    specialty: 'Orthodontiste Spécialisée', color: '#EC4899', photoUrl: '/demo/dre-beatrice.png',
    schedules: [
      { weekday: 1, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      { weekday: 2, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      { weekday: 3, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      { weekday: 4, startTime: '08:00', endTime: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      { weekday: 5, startTime: '08:00', endTime: '16:00', lunchStart: '12:00', lunchEnd: '13:00' },
    ],
  })

  const julian = await findOrCreatePractitioner({
    firstName: 'Julian', lastName: 'Delamare', title: 'Dr',
    specialty: 'Chirurgien-Dentiste & Implantologie', color: '#10B981', photoUrl: '/demo/dr-julian.png',
    schedules: [
      { weekday: 1, startTime: '09:00', endTime: '18:00', lunchStart: '13:00', lunchEnd: '14:00' },
      { weekday: 2, startTime: '09:00', endTime: '18:00', lunchStart: '13:00', lunchEnd: '14:00' },
      { weekday: 3, startTime: '09:00', endTime: '18:00', lunchStart: '13:00', lunchEnd: '14:00' },
      { weekday: 4, startTime: '09:00', endTime: '18:00', lunchStart: '13:00', lunchEnd: '14:00' },
      { weekday: 5, startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00' },
    ],
  })

  // 4. Services — findOrCreate par nom
  async function findOrCreateService(data: {
    name: string; nameEn: string; description: string; imageUrl: string
    durationMin: number; priceCents: number; category: ServiceCategory
    requiresQuestionnaire?: boolean; requiresDeposit?: boolean; depositAmountCents?: number
  }) {
    const existing = await prisma.service.findFirst({ where: { tenantId: tenant.id, name: data.name } })
    if (existing) return existing
    return prisma.service.create({ data: { tenantId: tenant.id, ...data } })
  }

  const orthoService = await findOrCreateService({
    name: 'Consultation Orthodontie', nameEn: 'Orthodontic Consultation',
    description: 'Analyse complète de votre dentition avec scans 3D pour un alignement parfait.',
    imageUrl: '/demo/ortho-consult.png', durationMin: 30, priceCents: 10000,
    category: ServiceCategory.ORTHODONTICS, requiresQuestionnaire: true, requiresDeposit: true, depositAmountCents: 5000,
  })
  const examService = await findOrCreateService({
    name: 'Examen + Nettoyage', nameEn: 'Exam + Cleaning',
    description: 'Nettoyage professionnel et examen complet pour une santé buccale optimale.',
    imageUrl: '/demo/dental-exam.png', durationMin: 60, priceCents: 15000,
    category: ServiceCategory.PREVENTION, requiresQuestionnaire: true,
  })
  const blanchService = await findOrCreateService({
    name: 'Blanchiment Professionnel', nameEn: 'Professional Whitening',
    description: "Retrouvez l'éclat de votre sourire avec notre technologie de blanchiment au laser.",
    imageUrl: '/demo/whitening.png', durationMin: 90, priceCents: 45000,
    category: ServiceCategory.ESTHETIC, requiresDeposit: true, depositAmountCents: 10000,
  })
  const implantService = await findOrCreateService({
    name: 'Implants Dentaires', nameEn: 'Dental Implants',
    description: 'Solution permanente et esthétique pour remplacer les dents manquantes.',
    imageUrl: '/demo/implants.png', durationMin: 120, priceCents: 250000,
    category: ServiceCategory.SURGERY, requiresQuestionnaire: true, requiresDeposit: true, depositAmountCents: 50000,
  })
  const urgenceService = await findOrCreateService({
    name: 'Urgence Dentaire', nameEn: 'Dental Emergency',
    description: 'Prise en charge immédiate pour soulager vos douleurs et traiter les infections.',
    imageUrl: '/demo/emergency.png', durationMin: 45, priceCents: 8500,
    category: ServiceCategory.EMERGENCY,
  })

  // 5. Patients — upsert par email + tenantId
  async function upsertPatient(data: {
    firstName: string; lastName: string; email: string; phone: string; dateOfBirth?: Date
  }) {
    return prisma.patient.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: data.email } },
      update: {},
      create: { tenantId: tenant.id, ...data },
    })
  }

  const jean = await upsertPatient({
    firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@exemple.ca',
    phone: '514-555-9988', dateOfBirth: new Date('1985-05-15'),
  })
  const marie = await upsertPatient({
    firstName: 'Marie', lastName: 'Tremblay', email: 'marie.tremblay@exemple.ca',
    phone: '514-555-4421', dateOfBirth: new Date('1992-03-22'),
  })
  const sophie = await upsertPatient({
    firstName: 'Sophie', lastName: 'Gagnon', email: 'sophie.gagnon@exemple.ca',
    phone: '438-555-7712', dateOfBirth: new Date('1978-11-08'),
  })
  const marc = await upsertPatient({
    firstName: 'Marc', lastName: 'Bouchard', email: 'marc.bouchard@exemple.ca',
    phone: '514-555-3301', dateOfBirth: new Date('2001-07-14'),
  })
  const abba = await upsertPatient({
    firstName: 'Abba', lastName: 'Bassoum', email: 'bassoumamadou0@gmail.com',
    phone: '514-555-0001', dateOfBirth: new Date('2000-01-01'),
  })

  // 6. Créneaux — on efface les futurs RDVs demo puis on en recrée
  // (garde les passés pour l'historique, recrée les futurs pour que l'agenda soit toujours plein)
  await prisma.appointment.deleteMany({
    where: { tenantId: tenant.id, startsAt: { gte: new Date() } },
  })

  const today = startOfDay(new Date())

  function slot(daysFromNow: number, hour: number, minute = 0) {
    return setMinutes(setHours(addDays(today, daysFromNow), hour), minute)
  }

  const appointments: Array<{
    patientId: string; practitionerId: string; serviceId: string
    startsAt: Date; endsAt: Date; status: AppointmentStatus; notes?: string
  }> = [
    // Cette semaine
    { patientId: jean.id,   practitionerId: dante.id,    serviceId: examService.id,    startsAt: slot(0, 9),   endsAt: slot(0, 10),   status: AppointmentStatus.CONFIRMED, notes: 'Nettoyage annuel.' },
    { patientId: marie.id,  practitionerId: beatrice.id, serviceId: orthoService.id,   startsAt: slot(0, 11),  endsAt: slot(0, 11, 30), status: AppointmentStatus.CONFIRMED },
    { patientId: sophie.id, practitionerId: julian.id,   serviceId: implantService.id, startsAt: slot(1, 10),  endsAt: slot(1, 12),   status: AppointmentStatus.CONFIRMED, notes: 'Suite pose implant molaire.' },
    { patientId: marc.id,   practitionerId: dante.id,    serviceId: blanchService.id,  startsAt: slot(1, 14),  endsAt: slot(1, 15, 30), status: AppointmentStatus.CONFIRMED },
    { patientId: abba.id,   practitionerId: dante.id,    serviceId: examService.id,    startsAt: slot(2, 9),   endsAt: slot(2, 10),   status: AppointmentStatus.CONFIRMED, notes: 'Premier examen.' },
    { patientId: jean.id,   practitionerId: julian.id,   serviceId: urgenceService.id, startsAt: slot(2, 11),  endsAt: slot(2, 11, 45), status: AppointmentStatus.PENDING },
    { patientId: marie.id,  practitionerId: dante.id,    serviceId: examService.id,    startsAt: slot(3, 8, 30), endsAt: slot(3, 9, 30), status: AppointmentStatus.CONFIRMED },
    { patientId: sophie.id, practitionerId: beatrice.id, serviceId: orthoService.id,   startsAt: slot(3, 14),  endsAt: slot(3, 14, 30), status: AppointmentStatus.CONFIRMED },
    { patientId: marc.id,   practitionerId: julian.id,   serviceId: implantService.id, startsAt: slot(4, 9),   endsAt: slot(4, 11),   status: AppointmentStatus.CONFIRMED, notes: 'Consultation pré-implant.' },
    { patientId: abba.id,   practitionerId: beatrice.id, serviceId: orthoService.id,   startsAt: slot(4, 15),  endsAt: slot(4, 15, 30), status: AppointmentStatus.CONFIRMED },
    // Semaine prochaine
    { patientId: jean.id,   practitionerId: beatrice.id, serviceId: orthoService.id,   startsAt: slot(7, 10),  endsAt: slot(7, 10, 30), status: AppointmentStatus.CONFIRMED },
    { patientId: marie.id,  practitionerId: julian.id,   serviceId: blanchService.id,  startsAt: slot(7, 13),  endsAt: slot(7, 14, 30), status: AppointmentStatus.CONFIRMED },
    { patientId: sophie.id, practitionerId: dante.id,    serviceId: examService.id,    startsAt: slot(8, 9),   endsAt: slot(8, 10),   status: AppointmentStatus.CONFIRMED },
    { patientId: marc.id,   practitionerId: beatrice.id, serviceId: orthoService.id,   startsAt: slot(8, 11),  endsAt: slot(8, 11, 30), status: AppointmentStatus.CONFIRMED },
    { patientId: abba.id,   practitionerId: julian.id,   serviceId: examService.id,    startsAt: slot(9, 14),  endsAt: slot(9, 15),   status: AppointmentStatus.CONFIRMED, notes: 'Suivi post-traitement.' },
    { patientId: jean.id,   practitionerId: dante.id,    serviceId: urgenceService.id, startsAt: slot(10, 8, 30), endsAt: slot(10, 9, 15), status: AppointmentStatus.PENDING },
    { patientId: sophie.id, practitionerId: julian.id,   serviceId: implantService.id, startsAt: slot(11, 10), endsAt: slot(11, 12),  status: AppointmentStatus.CONFIRMED },
    // Passés (historique)
    { patientId: jean.id,   practitionerId: dante.id,    serviceId: examService.id,    startsAt: slot(-7, 9),  endsAt: slot(-7, 10),  status: AppointmentStatus.COMPLETED },
    { patientId: marie.id,  practitionerId: beatrice.id, serviceId: orthoService.id,   startsAt: slot(-5, 11), endsAt: slot(-5, 11, 30), status: AppointmentStatus.COMPLETED },
    { patientId: abba.id,   practitionerId: dante.id,    serviceId: blanchService.id,  startsAt: slot(-3, 14), endsAt: slot(-3, 15, 30), status: AppointmentStatus.COMPLETED, notes: 'Blanchiment terminé, très satisfait.' },
  ]

  await prisma.appointment.createMany({
    data: appointments.map(a => ({ tenantId: tenant.id, ...a })),
  })

  console.log(`✅ Demo seed terminé — ${appointments.length} créneaux créés pour le tenant "${tenant.slug}".`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
