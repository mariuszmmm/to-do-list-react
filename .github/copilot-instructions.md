# Copilot Instructions for AI Coding Agents

## Project Overview

- **Type:** Full-stack to-do list app (React + TypeScript frontend, Netlify Functions backend)
- **Key Tech:** React, Redux Toolkit, Redux Saga, TanStack Query, react-i18next, Styled Components, MongoDB, Netlify GoTrue, EmailJS, Web Speech API
- **Monorepo Structure:**
  - `src/` — React app (features, hooks, common UI, types, utils)
  - `netlify/functions/` — Serverless backend (data, auth, backup, translation)
  - `public/` and `build/` — Static assets and build output

## Architecture & Data Flow

- **Frontend:**
  - State: Redux Toolkit + Redux Saga for async flows, TanStack Query for server state
  - i18n: `react-i18next` with language files in `public/exampleTasks/` and `src/utils/i18n/`
  - UI: Modular, styled with Styled Components; reusable containers in `src/common/`
  - Features: Task CRUD, undo/redo, voice input, list sync, Google Drive backup, user account management
- **Backend:**
  - Netlify Functions in `netlify/functions/` handle data CRUD, auth, backup/restore, translation, and Google Drive integration
  - MongoDB for persistent storage (see `.env.example` for required variables)
  - Auth via Netlify GoTrue (JWT tokens)

## Developer Workflows

- **Start Dev Server:** `npm start` (runs `netlify dev` for both frontend and functions)
- **Build:** `npm run build` (React build)
- **Test:** `npm test` (Jest + React Testing Library)
- **Deploy:** `npm run deploy` (to GitHub Pages)
- **Env Vars:** Copy `.env.example` to `.env` and fill in secrets for local/dev/Netlify
- **Netlify Functions:** Use local emulation via `netlify dev` for full-stack testing

## Project-Specific Patterns & Conventions

- **Async Logic:** Use Redux Saga for complex flows (see `src/rootSaga.ts`)
- **API Calls:** Centralized in `src/api/` and `netlify/functions/`
- **i18n:** Add new languages in `public/exampleTasks/` and `src/utils/i18n/locales/`
- **UI:** Prefer `src/common/` components for layout and controls; style with Styled Components
- **Voice Input:** Handled via custom hook `useSpeechToText` and Web Speech API typings in `src/@types/custom.d.ts`
- **Account/Sync:** User/account flows in `src/features/AccountPage/`, sync in `src/components/ListSyncManager.tsx`
- **Testing:** See `TESTING.md` for CI, pre-commit, and local test setup

## Integration Points

- **MongoDB:** Used by Netlify Functions for all persistent data
- **Google Drive:** Backup/restore via Netlify Functions and Google API (see `BACKUP_SETUP.md`)
- **EmailJS:** Contact form integration (see `README.md`)
- **Ably:** Real-time sync (see env vars and `src/components/AblyManager.tsx`)

## Examples

- **Add a new task feature:**
  - UI: `src/common/Form/`, logic: `src/features/tasks/`, API: `src/api/fetchDataApi.ts`
- **Add a new Netlify Function:** Place in `netlify/functions/`, export as handler, update redirects in `netlify.toml`
- **Add a new language:** Add JSON in `public/exampleTasks/` and update `src/utils/i18n/locales/`

## References

- See `README.md` and `README-pl.md` for user and setup docs
- See `BACKUP_SETUP.md` for Google Drive integration
- See `TESTING.md` for test/CI setup

---

**If unsure about a pattern, check for similar usage in `src/features/`, `src/common/`, or `netlify/functions/`.**
