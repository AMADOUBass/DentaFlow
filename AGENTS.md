# AGENTS.md
## Projet
DentaFlow — plateforme web multi-tenant pour centres dentaires du Québec.

## Règles absolues
1. **Langue**: UI en français par défaut, avec support anglais via i18n.
2. **Timezone**: `America/Toronto` partout. Utiliser `date-fns-tz`.
3. **Tenant isolation**: TOUTE requête DB doit filtrer par `tenantId`.
   Jamais de requête qui peut retourner les données d'un autre tenant.
4. **Loi 25**: données patients sensibles, hébergement Canada uniquement.
5. **TypeScript strict**: `strict: true`. Pas de `any`, utiliser `unknown`.
6. **Server Components par défaut**. Client Components seulement si interactivité.
7. **Forms**: react-hook-form + zod resolver. Validation côté serveur aussi.
8. **Styles**: Tailwind v4 uniquement. Pas de CSS custom sauf @theme.
9. **Composants UI**: shadcn/ui en priorité. Personnaliser via cn().
10. **Accessibility**: toutes pages WCAG AA minimum.

## Commandes
```
npm run dev         # Lancer en dev (Turbopack)
npm run build       # Build prod
npm run lint        # ESLint
npm run type-check  # tsc --noEmit
npx prisma migrate dev    # Nouvelle migration
npx prisma studio         # Interface DB
npx prisma db seed        # Seed démo
```

## Structure à respecter
Voir le document de spec. Ne pas créer de dossiers en dehors de cette structure.

## Quand tu ajoutes une fonctionnalité
1. Mettre à jour `prisma/schema.prisma` si besoin.
2. Créer le schema Zod dans `src/schemas/`.
3. Créer la server action dans `src/server/`.
4. Créer l'API route si nécessaire dans `src/app/api/`.
5. Créer l'UI dans `src/components/`.
6. Tester le parcours complet.

## Éviter
- localStorage/sessionStorage (pas supporté dans artifacts d'Anthropic).
- Requêtes DB sans tenantId.
- Dépendances non listées dans la section Stack du PDF.
- Utiliser des versions antérieures à celles spécifiées.
