# Cramtime System Architecture

## Overview

Cramtime is a modern, serverless exam-prep platform leveraging the best developer ergonomics and scalability from the Jamstack, Firebase, and generative AI. Its architecture ensures great performance, accessibility, and minimal DevOps overhead.

---

## Key Components

**Frontend (Astro + React):**
- Astro renders nearly all content as SEO-perfect static pages.
- "Islands" architecture hydrates only interactive areas (quizzes, chat tutor, flashcards) as React components.
- Tailwind CSS & shadcn/ui enable fast, accessible development; Framer Motion animates user interactions.
- Firebase client SDK is used for Auth, Firestore, and Storage directly from UI with robust offline support.

**Backend (Firebase):**
- **Firestore:** NoSQL DB for content, users, and activity. Optimized for real-time data and easy rule-based access controls.
- **Cloud Functions:** Secure, scalable business logic:
    - AI endpoints (Gemini API invocations for quiz/flashcard/essay generation)
    - Data validation/hooks (user onboarding, progress logging, email triggers)
    - API surface for frontend islands (e.g. `/api/generateFlashcards`, `/api/tutorChat`, `/api/scoreEssay`)
- **Auth:** Manages user accounts (email/password + Google SSO).
- **Storage:** Hosts PDFs, images, and assets with user-based access controls.
- **Security Rules:** Strong public/private split—user data isolated, content safe for global read.

**AI Integration (Gemini via Vertex AI):**
- All generative features (quizzes, flashcards, essay scoring, chat) are invoked via Functions—never exposing API tokens client-side.
- Potential to swap models or providers without changing frontend.

**Third-Party Services:**
- Scheduling (Cal.com/Calendly), Analytics (GA/Plausible), Error Logging (Sentry), and full-text Search (Algolia) are all integrated.
- Firebase Extensions streamline search/OCR/email.

**DevOps (GitHub Actions & Hosting):**
- Lint, format, test, build, and deploy flows ensure consistent, reviewable code.
- Every PR is previewed via Firebase Hosting Preview Channels and Lighthouse CI.
- Production is 1-command deploy and zero-maintenance scaling.

---

## Flow Summary

1. **User hits Astro/React app:** Public pages load static/SSR HTML, React islands hydrate as needed.
2. **User signs up/logs in:** Auth via Firebase; only their data accessible client-side.
3. **Interactive features:** React islands read/write Firestore, call Functions for AI/compute.
4. **AI features (quizzes, chat, essay):** Trigger backend Functions, which query Gemini and return results.
5. **Progress and analytics:** Updates written back to Firestore, analytics events sent as allowed.
6. **DevOps:** On code change, CI ensures tests and deploy previews; no downtime releases.

---

## Security and Scaling

- Every piece of user data is protected at the Firestore rules layer.
- Auth & Storage rules prevent leaks; only public libraries are world-readable.
- Cloud Functions and static hosting minimize server ops and DDoS risk.
- Firestore and Functions scale horizontally as userbase grows—no rate limits for educational scale.

---

## Accessibility and SEO

- Strict WCAG 2.1 AA: semantic markup, alt text, strong contrast, keyboard navigation, axe/RTL tests.
- Astro’s model ensures Google/Search crawlers see full, fast content.
- Sitemaps and meta/structured data enhance discoverability.

---

**Full data model, code artifacts, CI, and test scaffolding are in this repo.**