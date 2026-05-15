# FlowBrand UI – Login Flow

Complete authentication application (login, registration, forgot password, reset password, dashboard, legal pages) built with Next.js, TypeScript, Tailwind CSS, Zod, React Hook Form, and Zustand.

## Live Demo

[https://flowbrand-ui.vercel.app](https://flowbrand-ui.vercel.app)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/ton-compte/flowbrand-ui
cd flowbrand-ui

# Install dependencies
npm install

# Start development server
npm run dev
Open http://localhost:3000

---

## Available Pages
Page	URL	Description
Login	/login	User login (email + password)
Register	/register	Account creation with validation
Forgot Password	/forgot-password	Password reset request
Dashboard	/dashboard	Protected page after login
Terms & Conditions	/terms	Terms of use

---

## Tech Stack
Technology	Role
Next.js 16 (App Router)	React Framework
TypeScript	Static typing
Tailwind CSS	Styling & responsive
Zod	Form validation
React Hook Form	Form management
Zustand	Global state (authentication)
Lucide Icons	Icons (optional)

---

##  Project Structure

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

##  Features
✅ Form validation (Zod + React Hook Form)

✅ Password visibility toggle (eye icon)

✅ Authentication simulation (development mode)

✅ Page redirects (login → dashboard, etc.)

✅ Responsive marketing sidebar (hidden on mobile)

✅ Protected dashboard + logout

✅ Terms & Conditions page with sticky sidebar

---

## Authentication Simulation
In development mode, the authentication service accepts any email and password. For production, replace authService.ts with a real API call.

---

## Responsive Design
Desktop (> 768px): Two columns (sidebar + form)
Mobile (< 768px): Single column, sidebar hidden

---

## Testing

npm run dev
# Then visit:
# - http://localhost:3000/login
# - http://localhost:3000/register
# - http://localhost:3000/forgot-password
# - http://localhost:3000/terms
# - http://localhost:3000/dashboard (after login)

---

## Possible Improvements

Integrate a real backend (REST API)
More detailed error handling
Unit tests with Jest / Testing Library
Internationalization (i18n)

---

##  Author
ALAYDE Malomon Araffath – HNG Internship 2026

GitHub: m-tech-cod


