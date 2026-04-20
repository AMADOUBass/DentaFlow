import { redirect } from 'next/navigation'

/**
 * Route racine du dashboard admin
 * Redirige vers la page dashboard par défaut.
 */
export default function AdminRootPage() {
  redirect('/admin/dashboard')
}
