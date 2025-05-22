# Cramtime

A full-stack, AI-powered exam-prep platform for AP, SAT, and ACT.

> **Important:** This project is configured for deployment on Vercel. See frontend/deploy.md for detailed deployment instructions and environment variables.

## Tech Stack

- **Frontend:** Astro, React, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Firebase Functions (TypeScript), Firestore, Auth, Storage
- **AI:** Google Gemini (via Vertex AI or API)
- **CI/CD:** GitHub Actions, Firebase Hosting

## Getting Started

1. `cd frontend && npm install`
2. `cd ../functions && npm install`
3. Set up Firebase project, update configs.
4. `firebase emulators:start` for local dev.
5. `firebase deploy` to deploy.

See each folder for more details.

# Cramtime Full-Stack Monorepo

Welcome to the **Cramtime** full-stack exam-prep platform! This monorepo provides a modern, scalable, and accessible architecture with:

- **Frontend:** Astro + React (islands), Tailwind, shadcn/ui, Framer Motion  
- **Backend:** Firebase (Firestore, Auth, Cloud Functions, Storage)  
- **AI Integration:** Gemini/Vertex AI via Functions  
- **Testing:** Jest, React Testing Library, Playwright  
- **CI/CD:** GitHub Actions, automatic previews/deploys  
- **Accessibility & SEO:** WCAG 2.1 AA, best-in-class meta, theme, and skip links

## Project Structure

```
/
│
├── frontend/            # Astro project root (UI, islands, Tailwind, shadcn/ui, SEO)
│   ├── astro.config.mjs
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── components/   # React islands, UI primitives, auth, quiz, chat, etc.
│   │   ├── layouts/      # Astro layout files
│   │   ├── pages/        # Astro routes/pages
│   │   ├── styles/       # Tailwind CSS config, global styles
│   │   └── utils/        # Shared helpers (e.g. Firebase init)
│   └── tests/            # Jest/React Testing Library tests
│
├── functions/           # Firebase Cloud Functions backend (Node.js/TS)
│   ├── src/
│   │   ├── ai/           # Gemini API integration, prompt builders
│   │   ├── triggers/     # Firestore/onCall event handlers
│   │   └── utils/        # Shared backend logic (e.g. validators)
│   ├── tests/            # Jest tests for backend
│   └── package.json
│
├── firestore.rules      # Firestore security rules (root of repo)
│
├── .github/
│   └── workflows/
│       ├── ci.yml       # CI: lint, test, e2e, build, firebase preview/live deploy
│       └── lighthouse.yml  # Site quality checks
│
├── docs/                # Architecture, API docs, onboarding, diagrams (Mermaid)
│   └── architecture.md
│   └── data-model.md
│
└── README.md            # (This file)

## Getting Started

- See **frontend/README.md** for UI setup & theming
- See **functions/README.md** for backend/cloud functions
- See **docs/** for architecture, onboarding, and data model

## Key Technologies  
- [Astro](https://astro.build)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Firebase](https://firebase.google.com)
- [Google Gemini / Vertex AI](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview)
- [Jest](https://jestjs.io/)
- [Playwright](https://playwright.dev)
- [GitHub Actions](https://github.com/features/actions)
- [Sentry](https://sentry.io/)
- [Plausible Analytics](https://plausible.io/)

---

**Next up:** Firestore data model as TypeScript types/interfaces.  
Let me know if you'd like to focus anywhere first!