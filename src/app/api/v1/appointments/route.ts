import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey } from '@/lib/api-auth'
import { triggerWebhook } from '@/lib/webhooks'
import { z } from 'zod'

const createSchema = z.object({
  patientId: z.string().cuid(),
  practitionerId: z.string().cuid(),
  serviceId: z.string().cuid(),
  startsAt: z.string().datetime(),
  notes: z.string().optional()
})

/**
 * @openapi
 * /api/v1/appointments:
 *   get:
 *     summary: List appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW] }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: List of appointments
 */
export async function GET(req: NextRequest) {
  const auth = await validateApiKey(req)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const status = searchParams.get('status')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200)

  const appointments = await prisma.appointment.findMany({
    where: {
      tenantId: auth.tenantId,
      ...(from ? { startsAt: { gte: new Date(from) } } : {}),
      ...(to ? { startsAt: { lte: new Date(to) } } : {}),
      ...(status ? { status: status as any } : {})
    },
    include: {
      patient: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      practitioner: { select: { id: true, firstName: true, lastName: true, title: true } },
      service: { select: { id: true, name: true, durationMin: true, priceCents: true } }
    },
    orderBy: { startsAt: 'asc' },
    take: limit
  })

  return NextResponse.json({ data: appointments, count: appointments.length })
}

/**
 * @openapi
 * /api/v1/appointments:
 *   post:
 *     summary: Create an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, practitionerId, serviceId, startsAt]
 *             properties:
 *               patientId: { type: string }
 *               practitionerId: { type: string }
 *               serviceId: { type: string }
 *               startsAt: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Appointment created
 *       422:
 *         description: Validation error
 */
export async function POST(req: NextRequest) {
  const auth = await validateApiKey(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation error', details: parsed.error.issues }, { status: 422 })
  }

  const { patientId, practitionerId, serviceId, startsAt, notes } = parsed.data

  const service = await prisma.service.findFirst({
    where: { id: serviceId, tenantId: auth.tenantId }
  })
  if (!service) {
    return NextResponse.json({ error: 'Service not found.' }, { status: 404 })
  }

  const start = new Date(startsAt)
  const end = new Date(start.getTime() + service.durationMin * 60000)

  const appointment = await prisma.appointment.create({
    data: {
      tenantId: auth.tenantId,
      patientId,
      practitionerId,
      serviceId,
      startsAt: start,
      endsAt: end,
      status: 'PENDING',
      notes
    },
    include: {
      patient: { select: { id: true, firstName: true, lastName: true, email: true } },
      service: { select: { id: true, name: true } },
      practitioner: { select: { id: true, firstName: true, lastName: true } }
    }
  })

  triggerWebhook(auth.tenantId, 'appointment.created', appointment)

  return NextResponse.json({ data: appointment }, { status: 201 })
}
