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

  // Si le lien est déjà absolu ou commence par http, on ne touche à rien
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return <Link href={href} {...props}>{children}</Link>
  }

  // On injecte la locale si elle n'est pas déjà présente dans le href
  const hasLocale = href.startsWith('/fr') || href.startsWith('/en')
  const finalHref = hasLocale ? href : `/${locale}${href === '/' ? '' : href}`

  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  )
}
