co# Cramtime Frontend (Astro + React + Tailwind + Firebase)

## Setup

1.  `cd frontend && npm install`
2.  `cp .env.example .env` and fill in Firebase public config
3.  `npm run dev` (open http://localhost:4321)

## Features

- **Astro:** SEO-fast, static-first, React islands for interaction
- **React:** Auth, quizzes, chat, all dynamic UI
- **Tailwind CSS:** Clean, utility-first, with dark mode
- **shadcn/ui:** Accessible, prebuilt React components
- **Framer Motion:** Animations for quizzes, onboarding, menus
- **Firebase:** Auth, Firestore, Storage (client config in `src/utils/firebase.ts`)

## Linting, Formatting, & Testing

- `npm run format` – Prettier
- `npm run test` – Jest/RTL unit tests (components, utils)
- `npm run test:e2e` – Playwright E2E (see tests/e2e/)
- Accessibility: Axe/`@axe-core/react` in tests

## Conventions

- Keep interactive UI in `/components`, pages in `/pages`
- Use `.astro` layout for all pages
- Compose UI with shadcn/ui and Tailwind for consistency and a11y
- Use semantic HTML, alt text, aria-* and color contrast — enforced in CI

## Deployment

Frontend is built and deployed with Firebase Hosting CI/CD pipeline (see root github workflows).