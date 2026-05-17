import { getLocaleServer } from '@/lib/i18n-server'
import { PricingClient } from './PricingClient'
import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oros.ca'

export const metadata: Metadata = {
  title: 'Tarifs | Oros',
  description: 'Des forfaits clairs et prévisibles pour propulser votre clinique dentaire. Essentiel 149$/mois, Complet 399$/mois, Premium 899$/mois. Essai gratuit 14 jours.',
  openGraph: {
    title: 'Tarifs Oros — Plans dentaires transparents',
    description: 'Essentiel, Complet ou Premium. Essai gratuit 14 jours, sans carte de crédit.',
    images: [`${BASE_URL}/api/og/marketing?title=Tarifs+Oros&subtitle=Essai+gratuit+14+jours+%E2%80%94+sans+carte+de+cr%C3%A9dit&tag=Tarifs`],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${BASE_URL}/api/og/marketing?title=Tarifs+Oros&subtitle=Essai+gratuit+14+jours+%E2%80%94+sans+carte+de+cr%C3%A9dit&tag=Tarifs`],
  }
}

export default async function PricingPage() {
  const locale = await getLocaleServer()

  return <PricingClient locale={locale} />
}
