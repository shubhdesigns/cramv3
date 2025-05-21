# Cramtime Contribution Guide

Welcome! To run, test, and contribute to Cramtime:

## Prerequisites

- Node.js 18+, npm 9+, Firebase CLI, Git
- (Optional) VSCode + GitHub Copilot

## Local setup

```bash
git clone https://github.com/your-org/cramtime.git
cd cramtime
npm install -g firebase-tools
cd frontend && npm ci         # Astro + React
cd ../functions && npm ci     # Firebase Functions
cd ..
```

## Firestore + Functions Emulation

- `firebase login`
- `firebase init emulators`
- `firebase emulators:start`

## Frontend Dev Mode

```bash
cd frontend
npm run dev
```

## Run Tests

- Frontend: `npm test`
- Backend: `npm test`
- E2E: `npm run test:e2e` (Playwright)

## Lint & Format

```bash
npm run lint
npm run format
```

## Deploy

- Staging: Use PR (triggers auto-deploy via GitHub Actions to preview)
- Production: Merge to `main` (auto-deploy to live in CI)

---

Happy contributing! See `/docs/data-model.md` for Firestore models and `/docs/architecture.md` for system diagrams.