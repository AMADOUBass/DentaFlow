import { SwaggerClient } from './SwaggerClient'
import { Code2, Shield, Zap, Globe } from 'lucide-react'

const apiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Oros API',
    version: '1.0.0',
    description:
      "L'API REST d'Oros permet aux cliniques dentaires (plan Premium) d'intégrer leurs systèmes tiers : logiciels de facturation, CRM, applications mobiles personnalisées, etc.",
    contact: {
      name: 'Support Oros',
      email: 'support@orosdental.com'
    }
  },
  servers: [
    {
      url: 'https://app.orosdental.com',
      description: 'Production'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'API Key',
        description:
          'Clé API générée depuis Réglages → API & Intégrations. Format: `Authorization: Bearer oros_live_...`'
      }
    },
    schemas: {
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          startsAt: { type: 'string', format: 'date-time' },
          endsAt: { type: 'string', format: 'date-time' },
          status: {
            type: 'string',
            enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
          },
          notes: { type: 'string', nullable: true },
          patient: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' }
            }
          },
          practitioner: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              title: { type: 'string' }
            }
          },
          service: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              durationMin: { type: 'integer' },
              priceCents: { type: 'integer', nullable: true }
            }
          }
        }
      },
      Patient: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          dateOfBirth: { type: 'string', format: 'date', nullable: true },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Appointments', description: 'Gestion des rendez-vous' },
    { name: 'Patients', description: 'Accès aux dossiers patients' }
  ],
  paths: {
    '/api/v1/appointments': {
      get: {
        summary: 'Lister les rendez-vous',
        tags: ['Appointments'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'from',
            in: 'query',
            description: 'Date de début (ISO 8601)',
            schema: { type: 'string', format: 'date', example: '2026-06-01' }
          },
          {
            name: 'to',
            in: 'query',
            description: 'Date de fin (ISO 8601)',
            schema: { type: 'string', format: 'date', example: '2026-06-30' }
          },
          {
            name: 'status',
            in: 'query',
            description: 'Filtrer par statut',
            schema: {
              type: 'string',
              enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
            }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Nombre maximum de résultats (max 200)',
            schema: { type: 'integer', default: 50, maximum: 200 }
          }
        ],
        responses: {
          '200': {
            description: 'Liste des rendez-vous',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } },
                    count: { type: 'integer' }
                  }
                }
              }
            }
          },
          '401': { description: 'Clé API manquante ou invalide', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '403': { description: 'Plan Premium requis', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      },
      post: {
        summary: 'Créer un rendez-vous',
        tags: ['Appointments'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['patientId', 'practitionerId', 'serviceId', 'startsAt'],
                properties: {
                  patientId: { type: 'string', description: 'ID du patient (cuid)' },
                  practitionerId: { type: 'string', description: 'ID du praticien (cuid)' },
                  serviceId: { type: 'string', description: 'ID du service (cuid)' },
                  startsAt: { type: 'string', format: 'date-time', description: 'Début du rendez-vous (ISO 8601)' },
                  notes: { type: 'string', description: 'Notes optionnelles' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Rendez-vous créé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Appointment' } }
                }
              }
            }
          },
          '401': { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '422': { description: 'Erreur de validation', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/api/v1/patients': {
      get: {
        summary: 'Lister les patients',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Recherche par nom, courriel ou téléphone',
            schema: { type: 'string' }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Nombre maximum de résultats (max 200)',
            schema: { type: 'integer', default: 50, maximum: 200 }
          }
        ],
        responses: {
          '200': {
            description: 'Liste des patients',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Patient' } },
                    count: { type: 'integer' }
                  }
                }
              }
            }
          },
          '401': { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '403': { description: 'Plan Premium requis', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    }
  }
}

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Oros API</h1>
              <p className="text-slate-400 text-sm font-medium">Documentation des développeurs · v1.0</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Shield,
                title: 'Authentification Bearer',
                desc: 'Clé API générée depuis votre tableau de bord (Plan Premium requis).'
              },
              {
                icon: Zap,
                title: 'Webhooks temps réel',
                desc: 'Recevez des événements signés HMAC-SHA256 sur vos endpoints HTTPS.'
              },
              {
                icon: Globe,
                title: 'REST JSON',
                desc: 'API simple et prévisible. Réponses paginées avec champ `count`.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-2">
                <item.icon className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-white text-sm">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Authentification</p>
            <code className="text-sm text-emerald-400 font-mono">
              Authorization: Bearer oros_live_xxxxxxxxxxxxxxxxxxxx
            </code>
          </div>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SwaggerClient spec={apiSpec} />
      </div>
    </div>
  )
}
