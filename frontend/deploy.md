# Vercel Deployment Guide

Follow these steps to deploy your CramTime app to Vercel:

## 0. Fixes Made to the Codebase

We've made the following changes to ensure a successful deployment:

1. Fixed Firebase exports in `src/utils/firebase.js` to properly export `auth` and `db`
2. Updated `astro.config.mjs` to use the Vercel adapter
3. Added the Vercel adapter (`@astrojs/vercel`)    to package.json
4. Created a `vercel.json` configuration file

## 1. Set Up Your Environment Variables

Create a `.env` file in Vercel with the following variables:

```
PUBLIC_FIREBASE_API_KEY=AIzaSyC06t9ZPyS8k75bo0Rd4SR4RnIJb77jGIc
PUBLIC_FIREBASE_AUTH_DOMAIN=cramtime-study.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=cramtime-study
PUBLIC_FIREBASE_STORAGE_BUCKET=cramtime-study.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=595660764499
PUBLIC_FIREBASE_APP_ID=1:595660764499:web:3a14269c8cb79afa815da6
PUBLIC_FIREBASE_MEASUREMENT_ID=G-CE6YC9S0WQ
PUBLIC_SITE_URL=https://cramti.me
```

## 2. Set Up a New Project in Vercel

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Choose the `cramv3/frontend` directory as the Root Directory
5. Use the following build settings:
   - Framework Preset: Astro
   - Build Command: `npm run build`
   - Output Directory: `dist`

## 3. Configure Advanced Settings

1. In the project settings, set the following:
   - Root Directory: `frontend` (if you're importing the entire cramv3 repo)
   - Include all environment variables from the first step

## 4. Deploy!

Click the "Deploy" button and Vercel will build and deploy your site.

## 5. Set up a Custom Domain

Once deployed:
1. Go to "Settings" > "Domains"
2. Add your domain (e.g., cramti.me)
3. Verify and follow the instructions to set up DNS

## Troubleshooting

If you encounter Firebase-related errors:
1. Make sure your Firebase API keys are correctly set in the environment variables
2. Ensure your Firebase project has Authentication, Firestore, and other required services enabled
3. If using client-side Firebase, make sure your project's authorized domains include your Vercel deployment URL

For Astro-specific issues:
1. The `logo.png` file in the pages directory causes warnings - consider moving it to a public or assets directory
2. The sat-prep.astro file was causing route conflicts and has been deleted

For build errors:
1. Check the build logs in Vercel
2. Fix any import errors, especially those related to Firebase
3. Re-deploy after making changes   