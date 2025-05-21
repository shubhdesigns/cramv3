# Cramtime Backend: Firebase Functions

## Local Setup

1. `cd functions`
2. `npm install`
3. Copy `.env.example` to `.env` and add Gemini and Firebase secrets (see codebase)
4. Install/upgrade Firebase CLI: `npm install -g firebase-tools`
5. Start functions emulator: `firebase emulators:start --only functions,firestore,auth`
    - Supports hot-reloading and logs
    - Connect frontend to local emulator in dev as needed

## Development

- Functions are in `src/`, TypeScript preferred.
- Shared `utils/` for validation, Gemini, etc.
- Write new HTTPS or Firestore-triggered functions, export via `src/index.ts`.
- Keep data model changes aligned with `/docs/data-model.ts`.

## Testing

- Run unit tests in `/tests/`
    - `npm run test`
- Suggest: use [firebase-functions-test](https://firebase.google.com/docs/functions/unit-testing) for mocks

## Deployment

- Production deploy: `firebase deploy --only functions`
- Preview/CI deploy handled via GitHub Actions (see `.github/workflows/functions.yml`)
- Node.js 18 runtime, region `us-east1` preferred

## Security

- Keep all API keys (Gemini, admin service accounts) in config, **never** hardcoded.

## Updating/Extending

- Add new function stubs, test locally, PR for review. See the monorepo root/architecture docs for more.