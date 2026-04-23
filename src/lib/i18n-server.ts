import { headers } from 'next/headers'
import { Locale } from './i18n'

/**
 * Devrait être appelé uniquement dans les Server Components
 */
export async function getLocaleServer() {
  const headerList = await headers()
  return (headerList.get('x-locale') as Locale) || 'fr'
}
