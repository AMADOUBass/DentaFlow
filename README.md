# Oros 🦷🚀

Oros est une solution logicielle complète conçue pour simplifier la gestion des centres dentaires. Alliant une expérience patient fluide à des outils administratifs puissants, la plateforme répond aux exigences les plus strictes en matière de sécurité et de confidentialité (Loi 25).

## ✨ Fonctionnalités clés

- **Multi-Tenant** : Chaque clinique possède son propre espace sécurisé et sa base de données isolée.
- **Portail Patient** : Prise de rendez-vous en ligne, historique et notifications par courriel.
- **Gestion Administrative** : Tableau de bord complet pour la gestion des patients et des rendez-vous.
- **Sécurité Loi 25** : Chiffrement des données sensibles et journalisation des accès.
- **Multi-Domaine** : Support des domaines personnalisés pour chaque clinique (ex: `cliniquezenith.ca`).

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript (Strict)
- **Base de données** : Prisma + PostgreSQL (via Supabase)
- **Authentification** : Supabase Auth
- **Styles** : Tailwind CSS v4 & Lucide Icons
- **Composants UI** : Radix UI & Shadcn/UI
- **i18n** : Support natif Français (par défaut) et Anglais

## 🚀 Installation & Lancement

```bash
# 1. Cloner le projet
git clone https://github.com/AMADOUBass/Oros.git
cd Oros

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Remplir DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, etc.

# 4. Lancer en développement
npm run dev
```

## 📜 Licence

Propriété exclusive d'Oros. Tous droits réservés.
