import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ],
  output: "server", // Change to server for SSR support
  adapter: vercel(),
  site: process.env.PUBLIC_SITE_URL || "https://cramti.me", // Update for SEO
  markdown: {
    syntaxHighlight: 'prism', // Use Prism instead of Shiki to avoid dependency issues
  },
});

/*
Directory structure overview:
frontend/
│
├── astro.config.mjs
├── package.json
├── public/
│   └── favicon.svg, images, etc.
├── src/
│   ├── components/
│   │   ├── Auth/                # React login/signup forms (islands)
│   │   ├── Quiz/                # Interactive quiz, question, result, review
│   │   ├── Flashcards/          # Flashcard display, generator, reviewer
│   │   ├── TutorChat/           # ChatBot (Gemini-powered), context handler
│   │   ├── UI/                  # shadcn/ui Buttons, Cards, layouts
│   │   └── ThemeSwitcher.tsx    # Light/dark mode toggle (Tailwind)
│   ├── layouts/
│   │   ├── Base.astro           # Main layout, SEO meta, skip nav, theme
│   │   └── Dashboard.astro      # User dashboard layout, protects routes
│   ├── pages/
│   │   ├── index.astro          # Landing page (mostly static)
│   │   ├── subjects.astro       # Subject navigator
│   │   ├── quiz/[quizId].astro  # Dynamic quiz page, React island
│   │   ├── flashcards.astro     # Flashcard generator/review page
│   │   ├── tutor.astro          # ChatBot page
│   │   ├── login.astro          # Auth island mount
│   │   └── 404.astro            # Custom error
│   ├── styles/
│   │   ├── tailwind.css         # Tailwind base imports
│   │   └── theme.css            # Extra colors, transitions
│   └── utils/
│       ├── firebase.ts          # Firebase JS SDK init (client)
│       ├── guards.ts            # Route protection helpers
│       └── types.ts             # Shared type imports
├── tests/
│   ├── components/              # Jest/RTL specs
│   ├── e2e/                     # Playwright tests/stories
│   └── setupTests.ts            # RTL, axe, test config
├── .env.example                 # Firebase config, Gemini endpoints (no secrets!)
└── README.md

Best practices:
- Astro for static/SSR SEO, React for all dynamic UI (as <ClientOnly> islands)
- Use shadcn/ui and Tailwind for WCAG 2.1 AA accessibility out of the box
- Framer Motion installed for React animation (see Quiz, onboarding, etc)
- All config (Firebase, Gemini endpoints) loaded from environment via utils/firebase.ts
*/