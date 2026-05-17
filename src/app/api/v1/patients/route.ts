import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey } from '@/lib/api-auth'

/**
 * @openapi
 * /api/v1/patients:
 *   get:
 *     summary: List patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name, email or phone
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: List of patients
 */
export async function GET(req: NextRequest) {
  const auth = await validateApiKey(req)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200)

  const patients = await prisma.patient.findMany({
    where: {
      tenantId: auth.tenantId,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search } }
            ]
          }
        : {})
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      createdAt: true
    },
    orderBy: { lastName: 'asc' },
    take: limit
  })

  return NextResponse.json({ data: patients, count: patients.length })
}
