import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Oros | Oros',
    short_name: 'Oros',
    description: 'Gestion de centres dentaires au Québec - Portail Patient & Admin',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    categories: ['medical', 'productivity', 'health'],
    shortcuts: [
      {
        name: 'Prendre Rendez-vous',
        short_name: 'RDV',
        description: 'Planifier une consultation dentaire',
        url: '/rendez-vous',
        icons: [{ src: '/icon.png', sizes: '192x192' }]
      },
      {
        name: 'Urgences',
        short_name: 'Urgence',
        description: 'Signaler une urgence dentaire',
        url: '/urgences',
        icons: [{ src: '/icon.png', sizes: '192x192' }]
      }
    ],
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
