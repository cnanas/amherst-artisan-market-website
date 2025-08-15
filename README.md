# Amherst Artisan and Crafters Market — GitHub Pages Deployment Guide

This repository is configured to build a static React + TypeScript site with Vite and Tailwind CSS and deploy it to GitHub Pages via Actions.

## What’s included

- Build toolchain: [package.json](package.json), [vite.config.ts](vite.config.ts), [index.html](index.html), [src/main.tsx](src/main.tsx), [postcss.config.js](postcss.config.js), [tailwind.config.ts](tailwind.config.ts), [styles/globals.css](styles/globals.css)
- App entry and components: [App.tsx](App.tsx), [components/Header.tsx](components/Header.tsx), [components/Hero.tsx](components/Hero.tsx), [components/VendorShowcase.tsx](components/VendorShowcase.tsx), [components/VendorApplication.tsx](components/VendorApplication.tsx)
- Deployment workflow: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- Backend (Supabase Edge Function) source: [supabase/functions/server/index.tsx](supabase/functions/server/index.tsx)

## Prerequisites

- Node.js 20+
- A GitHub account and a repository
- A Supabase project (for Edge Functions and database) and a Resend account/key

## Run locally

- Install dependencies: npm install
- Start dev server: npm run dev
- Open http://localhost:5173

## Create GitHub repository and push

- Initialize git: git init
- Commit files: git add -A && git commit -m "init site"
- Create repo on GitHub (empty), set remote: git remote add origin https://github.com/USER/REPO.git
- Push main: git branch -M main && git push -u origin main

## Enable GitHub Pages

- In the GitHub repository: Settings → Pages → Build and deployment → Source: GitHub Actions (the workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) is already present).
- On push to main, the action builds and deploys dist and creates a 404.html copy for SPA routing.
- The site will be available at https://USER.github.io/REPO/ after the first successful run.

## SPA routing and base path

- Vite base is configured to the repository name during Actions runs, see [vite.config.ts](vite.config.ts).
- In-app navigation uses the Pages base path through [import.meta.env.BASE_URL](components/Hero.tsx:2) and in history updates at [window.history.pushState](App.tsx:50).
- The workflow copies index.html to 404.html for client-side routing, see [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

## Logo and assets

- The Figma asset imports were replaced with a public logo at [public/logo.svg](public/logo.svg). It is referenced using the base URL in [components/Hero.tsx](components/Hero.tsx:2) and [components/Header.tsx](components/Header.tsx:2).

## Custom domain (optional)

- Create a [public/CNAME](public/CNAME) file containing your domain (e.g., www.example.com) and commit it.
- In GitHub → Settings → Pages, set the same custom domain and add the DNS records as instructed.
- When using a custom domain, Pages will serve at the domain root; the existing base logic in [vite.config.ts](vite.config.ts) will resolve to “/”. If you prefer to force a domain base, set base: '/'.

## Supabase Edge Functions and Resend

- The frontend calls a Supabase Edge Function deployed in your project at routes like /make-server-ff2da156. Source is in [supabase/functions/server/index.tsx](supabase/functions/server/index.tsx).
- To deploy/update with Supabase CLI:
  - supabase login
  - supabase link --project-ref YOUR_PROJECT_REF
  - supabase functions deploy make-server-ff2da156 --no-verify-jwt
- Configure function secrets (Dashboard → Edge Functions → Secrets, or CLI supabase secrets set) for:
  - RESEND_API_KEY
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
- These secrets are read via Deno.env in the function.

## Client Supabase configuration

- The public anon key and project id live in [utils/supabase/info.tsx](utils/supabase/info.tsx:1). These values are safe to expose client-side, but rotate if compromised.

## Admin portal

- Admin UI lives at the URL ending with /amherstmarket (e.g., https://USER.github.io/REPO/amherstmarket).
- The demo admin password is defined in [components/AdminLogin.tsx](components/AdminLogin.tsx:17). Change it before going public.

## Common tasks

- Run dev: npm run dev
- Build locally: npm run build
- Preview local build: npm run preview

## Troubleshooting

- Blank page or 404 on deep links: ensure Pages “Source” is GitHub Actions and that 404.html exists in the deployed artifact (workflow handles this).
- Assets not loading under /REPO/: confirm the base path logic in [vite.config.ts](vite.config.ts) and that you reference assets through [import.meta.env.BASE_URL](components/Hero.tsx:2).
- Vendor fetch/API issues: confirm the Edge Function is deployed and CORS is enabled in [supabase/functions/server/index.tsx](supabase/functions/server/index.tsx).

## Security notes

- Do not commit service role keys to the repo. Keep them only as Edge Function secrets.
- The client-side file [utils/supabase/info.tsx](utils/supabase/info.tsx:1) must never include private keys; only use the anon public key.

## Release checklist

- Push to main and wait for the “Deploy to GitHub Pages” workflow to finish.
- Visit the Pages URL and test navigation, vendor list, application submission, and admin dashboard.
- If using a custom domain, verify DNS and HTTPS status in Settings → Pages.