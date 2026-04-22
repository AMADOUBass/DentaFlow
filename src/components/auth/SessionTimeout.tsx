'use client'

import { useEffect, useRef } from 'react'
import { logout } from '@/server/auth'
import { useRouter } from 'next/navigation'

const TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes

export function SessionTimeout() {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    timeoutRef.current = setTimeout(async () => {
      console.log("[SECURITY]: Session timeout reached. Logging out.")
      await logout()
      router.push('/login?error=timeout')
    }, TIMEOUT_MS)
  }

  useEffect(() => {
    // Liste des événements considérés comme une "activité"
    const events = [
      'mousedown', 
      'mousemove', 
      'keypress', 
      'scroll', 
      'touchstart'
    ]

    // Initialisation
    resetTimeout()

    // Ajout des écouteurs
    events.forEach(event => {
      window.addEventListener(event, resetTimeout)
    })

    // Nettoyage
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      events.forEach(event => {
        window.removeEventListener(event, resetTimeout)
      })
    }
  }, [])

  return null // Composant invisible
}
