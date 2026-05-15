# FlowBrand UI – Login Flow

Application d’authentification complète (login, inscription, mot de passe oublié, reset password, dashboard, pages légales) développée avec Next.js, TypeScript, Tailwind CSS, Zod, React Hook Form et Zustand.

## Démo en ligne

[https://flowbrand-ui.vercel.app](https://flowbrand-ui.vercel.app) 

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/ton-compte/flowbrand-ui
cd flowbrand-ui

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
Ouvrir http://localhost:3000

---

## Pages disponibles
Page	URL	Description
Login	/login	Connexion utilisateur (email + mot de passe)
Register	/register	Création de compte avec validation
Forgot Password	/forgot-password	Demande de réinitialisation du mot de passe
Dashboard	/dashboard	Page protégée après connexion
Terms & Conditions	/terms	Conditions générales d’utilisation

---

## Stack technique
Technologie	Rôle
Next.js 16 (App Router)	Framework React
TypeScript	Typage statique
Tailwind CSS	Styles et responsive
Zod	Validation des formulaires
React Hook Form	Gestion des formulaires
Zustand	État global (authentification)
Lucide Icons	Icônes (optionnel)

---

## Structure du projet

src/
├── app/
│   ├── (main)/(auth-routes)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── terms/page.tsx
│   └── dashboard/page.tsx
├── components/features/auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ForgotPasswordForm.tsx
│   └── ResetPasswordForm.tsx
├── store/
│   └── authStore.ts
├── services/
│   └── authService.ts
├── schema/
│   └── authSchema.ts
└── types/
    └── auth.ts

---

##  Fonctionnalités
✅ Validation des formulaires (Zod + React Hook Form)

✅ Affichage/masquage du mot de passe (toggle œil)

✅ Simulation d’authentification (mode développement)

✅ Redirections entre pages (login → dashboard, etc.)

✅ Sidebar marketing responsive (cachée sur mobile)

✅ Dashboard protégé + déconnexion

✅ Page Terms & Conditions avec table des matières sticky


---

## Simulation d’authentification
En développement, le service d’authentification accepte n’importe quel email et mot de passe. Pour passer en production, remplace authService.ts par un vrai appel API.

---

## Responsive
Desktop (> 768px) : deux colonnes (sidebar + formulaire)
Mobile (< 768px) : une seule colonne, sidebar masquée

---

##  Tests

npm run dev
# Puis visite :
# - http://localhost:3000/login
# - http://localhost:3000/register
# - http://localhost:3000/forgot-password
# - http://localhost:3000/terms
# - http://localhost:3000/dashboard (après connexion)

---

## Améliorations possibles
Intégration d’un vrai backend (API REST)

Gestion des erreurs plus fine

Tests unitaires avec Jest / Testing Library

Internationalisation (i18n)

---

##  Auteur
ALAYDE Malomon Araffath – HNG Internship 2026

GitHub : m-tech-cod
