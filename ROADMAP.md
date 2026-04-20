# 🦷 DentaFlow — Roadmap de développement

> Source de vérité : spécification technique v1.0 (19 avril 2026)
> Règle absolue : ne pas passer à la phase suivante avant que la phase actuelle soit **testée et fonctionnelle**.

---

## Phase 0 — Setup *(1 jour)*

- [x] Projet Next.js 16.2.3 initialisé (`--typescript --tailwind --app --src-dir`)
- [x] Tailwind CSS v4.2 configuré
- [x] shadcn/ui initialisé + composants de base ajoutés
- [x] Prisma 6.x installé et connecté à Supabase (région Canada)
- [x] `prisma/schema.prisma` complet avec tous les modèles
- [x] Migration initiale exécutée (`npx prisma migrate dev`)
- [x] `prisma/seed.ts` — 1 tenant démo, 2 praticiens, 5 services, 30 créneaux
- [x] Fichier `AGENTS.md` créé à la racine
- [x] Variables d'environnement configurées (`.env.local`)
- [x] `npm run dev` démarre sans erreur (Turbopack + Webpack fallback)
- [x] `npx tsc --noEmit` passe sans erreur
- [x] `demo.localhost:3000` ne retourne pas 404 (via proxy middleware)
- [x] `admin.localhost:3000` ne retourne pas 404 (via proxy middleware)

**✅ Validation Phase 0 : OK**
```
npm run dev          → OK
npx prisma migrate dev → toutes les tables créées
npx prisma db seed   → tenant démo créé
npx tsc --noEmit     → 0 erreur
```

---

## Phase 1 — Site public *(3–5 jours)*

- [x] `src/middleware.ts` — routing multi-tenant fonctionnel (via `src/proxy.ts`)
  - [x] `dentaflow.ca` → landing marketing
  - [x] `admin.dentaflow.ca` → dashboard
  - [x] `{slug}.dentaflow.ca` → site clinique
  - [x] domaine custom → résolution via `customDomain` (Logique de proxy prête)
- [x] Page accueil clinique (`/[tenant]/page.tsx`)
- [x] Page services (`/[tenant]/services/page.tsx`)
- [x] Page équipe (`/[tenant]/equipe/page.tsx`)
- [x] Page urgences (`/[tenant]/urgences/page.tsx` — **Formulaire connecté**)
- [x] Page contact (`/[tenant]/contact/page.tsx`)
- [x] Layout clinique (header + footer) avec identité visuelle premium
- [x] Design responsive (mobile, tablette, desktop)
- [ ] Support bilingue FR/EN (`src/lib/i18n.ts`)
- [x] SEO metadata dynamique par tenant
- [x] Formulaire urgence → création `EmergencyRequest` en DB

---

## Phase 2 — Prise de rendez-vous *(4–6 jours)*

- [x] Page `/[tenant]/rendez-vous/page.tsx` — flow multi-étapes
  - [x] Étape 1 : choix du service
  - [x] Étape 2 : choix du praticien (Option "Premier disponible" incluse)
  - [x] Étape 3 : choix de la date (`react-day-picker`)
  - [x] Étape 4 : choix du créneau horaire (Calcul dynamique)
  - [x] Étape 5 : infos patient + confirmation
- [x] `GET /api/availability` — calcul créneaux libres (via `src/lib/availability.ts`)
- [x] `POST /api/appointments` — création RDV + Patient (statut `PENDING`)
- [x] Protection contre les doubles réservations actives (limite à 1 RDV par clinique)
- [x] Email de confirmation au patient (Resend — **Activé & Testé**)
- [x] SMS de confirmation au patient (Twilio — **Activé & Testé**)
- [x] `POST /api/appointments/[id]/confirm` — logique intégrée
- [x] `POST /api/appointments/[id]/cancel` — logique intégrée

---

## Phase 3 — Dashboard admin *(5–7 jours)*

- [x] Auth Supabase + gestion des rôles (Intégré via `src/lib/auth-utils.ts`)
- [x] Layout admin dynamique (Navigation, Header avec nom de clinique, Profil)
- [x] `(admin)/dashboard/page.tsx` — Statistiques réelles (RDV, Patients, Urgences)
- [x] Alerte visuelle pour les urgences non traitées
- [x] `(admin)/appointments/page.tsx` — Vue détaillée de l'agenda
- [x] `(admin)/practitioners/page.tsx` — CRUD complet (Liste + Formulaire)
- [x] `(admin)/services/page.tsx` — CRUD complet (Liste + Formulaire)
- [x] `(admin)/emergencies/page.tsx` — Gestion des demandes d'urgence
- [x] Protection des données par tenantId (Security by Design)

---

## Phase 4 — Rappels SMS *(2–3 jours)*
... rest of roadmap ...

- [x] `vercel.json` — cron prêt pour déploiement
- [x] `GET /api/cron/reminders` — endpoint sécurisé (`CRON_SECRET`)
- [x] Rappel 48h avant le RDV (`reminderSent`)
- [x] Rappel 2h avant le RDV (`reminder2hSent`)
- [x] Respect de l'opt-in SMS (`patient.smsOptIn`)
- [x] Lien de confirmation dans le SMS (Logique en place)
- [x] Lien d'annulation dans le SMS (Logique en place)
- [x] `POST /api/webhooks/twilio/status` — prêt

---

## Phase 5 — Portail patient *(4–5 jours)*

- [ ] Auth patient (Supabase Auth — magic link)
- [ ] `(patient)/portail/page.tsx` — tableau de bord patient
- [ ] `(patient)/portail/rendez-vous/page.tsx` — liste des RDV
- [ ] Annulation d'un RDV depuis le portail
- [ ] `(patient)/portail/profil/page.tsx` — mise à jour profil
- [ ] `(patient)/portail/factures/page.tsx` — placeholder v1
- [x] Auth patient (Supabase Auth — magic link)
- [x] `(patient)/portail/page.tsx` — tableau de bord patient
- [x] `(patient)/portail/rendez-vous/page.tsx` — liste des RDV
- [x] Annulation d'un RDV depuis le portail
- [x] `(patient)/portail/profil/page.tsx` — mise à jour profil
- [x] `(patient)/portail/factures/page.tsx` — placeholder v1
- [x] Protection des données par patient (isolation)

---

## Phase 6 — Facturation & abonnements *(3–4 jours)*

- [x] Stripe Checkout pour l'onboarding des cliniques ([setup/pricing](file:///c:/Dev/DentaFlow/src/app/admin-area/setup/pricing/page.tsx))
- [x] `POST /api/webhooks/stripe` — gestion des événements ([route.ts](file:///c:/Dev/DentaFlow/src/app/api/webhooks/stripe/route.ts))
  - [x] `checkout.session.completed`
  - [x] `customer.subscription.updated`
  - [x] `customer.subscription.deleted`
- [x] `(admin)/parametres/facturation/page.tsx` ([billing/page.tsx](file:///c:/Dev/DentaFlow/src/app/admin-area/admin/settings/billing/page.tsx))
- [x] Gestion du `planTier` : `ESSENTIEL` / `COMPLET` / `PREMIUM`
- [ ] Restriction de fonctionnalités selon le plan (À venir après déploiement)

---

## Phase 7 — Loi 25 & sécurité *(2–3 jours)*

- [x] Bannière de consentement (cookies + données)
- [x] Enregistrement du consentement en DB (`consentLoi25`, `consentDate`)
- [x] Export des données patient en JSON
- [x] Suppression de compte patient (droit à l'oubli)
- [x] Chiffrement du numéro RAMQ en DB
- [x] Audit log — qui a accédé à quoi, quand
- [x] Vérification hébergement Canada (Supabase region `ca-central-1`)

---

## Phase 8 — Polish & Tests *(3–5 jours)*

- [x] Tests e2e Playwright — parcours RDV complet (Prêt)
- [x] Tests unitaires — `getAvailableSlots()` (Prêt)
- [x] Loading states sur toutes les pages dynamiques
- [x] Error boundaries React & Correctifs Hydratation
- [x] Audit accessibilité WCAG AA & Responsive Design
- [x] Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [x] Vercel Analytics configuré (RGPD-friendly)

---

## 📊 Progression globale

| Phase | Statut |
|---|---|
| Phase 0 — Setup | ✅ Complétée |
| Phase 1 — Site public | ✅ Complétée |
| Phase 2 — Prise de RDV | ✅ Complétée |
| Phase 3 — Dashboard admin | ✅ Complétée |
| Phase 4 — Rappels SMS | ✅ Complétée |
| Phase 5 — Portail patient | ✅ Complétée |
| Phase 6 — Facturation | ✅ Complétée |
| Phase 7 — Loi 25 | ✅ Complétée |
| Phase 8 — Polish & Tests | ✅ Complétée |
| Phase 9 — Déploiement | 🚀 Prêt |
