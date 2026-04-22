import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { renderToStream } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/admin/billing/InvoicePDF'
import React from 'react'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getAdminUser()
    const tenantId = user.tenantId!

    const invoice = await (prisma as any).invoice.findUnique({
      where: { id, tenantId },
      include: {
        items: true,
        patient: true,
        tenant: true
      }
    })

    if (!invoice) {
        return new NextResponse('Facture non trouvée', { status: 404 })
    }

    const stream = await renderToStream(
      React.createElement(InvoicePDF, {
        invoice,
        clinic: invoice.tenant,
        patient: invoice.patient
      })
    )

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="facture-${id.slice(-6)}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF Generation Error:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
}
