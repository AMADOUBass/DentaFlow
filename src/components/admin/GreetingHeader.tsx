'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Moon, Sun, Coffee } from 'lucide-react'

interface GreetingHeaderProps {
  userName: string
}

export function GreetingHeader({ userName }: GreetingHeaderProps) {
  const [greeting, setGreeting] = useState({
    text: 'Bonjour',
    icon: <Sun className="h-6 w-6 text-amber-500" />,
    message: "Prêt pour une nouvelle journée ?"
  })

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting({
        text: 'Bon matin',
        icon: <Coffee className="h-6 w-6 text-amber-600" />,
        message: "On commence la journée du bon pied !"
      })
    } else if (hour >= 12 && hour < 18) {
      setGreeting({
        text: 'Bon après-midi',
        icon: <Sun className="h-6 w-6 text-amber-500" />,
        message: "Continuez votre excellent travail."
      })
    } else if (hour >= 18 && hour < 22) {
      setGreeting({
        text: 'Bonsoir',
        icon: <Moon className="h-6 w-6 text-indigo-400" />,
        message: "La journée tire à sa fin. Beau boulot !"
      })
    } else {
      setGreeting({
        text: 'Bonne nuit',
        icon: <Moon className="h-6 w-6 text-slate-400" />,
        message: "Il est tard, n'oubliez pas de vous reposer."
      })
    }
  }, [])

  return (
    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left duration-700">
      <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
        {greeting.icon}
      </div>
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          {greeting.text}, {userName} <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </h1>
        <p className="text-slate-500 mt-1 font-medium italic">{greeting.message}</p>
      </div>
    </div>
  )
}
