'use client'

import React from 'react'
import Link, { LinkProps } from 'next/link'
import { useParams } from 'next/navigation'

interface I18nLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
  href: string
}

/**
 * Composant Link intelligent qui injecte automatiquement la locale actuelle
 */
export function I18nLink({ href, children, ...props }: I18nLinkProps) {
  const params = useParams()
  const locale = params?.locale as string || 'fr'
  const tenant = params?.tenant as string

  // Si le lien est déjà absolu ou commence par http, on ne touche à rien
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return <Link href={href} {...props}>{children}</Link>
  }

  // On injecte la locale si elle n'est pas déjà présente dans le href
  const hasLocale = href.startsWith('/fr') || href.startsWith('/en')
  let finalHref = hasLocale ? href : `/${locale}${href === '/' ? '' : href}`

  // On ne rajoute le tenant slug que sur le domaine racine (oros.homes/demo/...).
  // Sur un sous-domaine (demo.oros.homes), le tenant est identifié par le host — pas le path.
  if (typeof window !== 'undefined' && tenant) {
    const isOnTenantSubdomain = window.location.hostname.startsWith(`${tenant}.`)

    if (!isOnTenantSubdomain) {
      const pathname = window.location.pathname
      const pathSegments = pathname.split('/').filter(Boolean)
      const isUsingSlugInPath = pathSegments[0] === tenant

      if (isUsingSlugInPath) {
        if (!finalHref.startsWith(`/${tenant}/`) && finalHref !== `/${tenant}`) {
          finalHref = `/${tenant}${finalHref}`
        }
      }
    }
  }

  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  )
}
