# Technical Architecture - LearnSpark

LearnSpark is built on a modern, event-driven architecture that prioritizes accessibility and sensory feedback.

## 🏗️ Folder Structure

- `src/app/` — Next.js App Router (Pages & API Routes).
- `src/components/` — Shared UI components (Common, Layout, etc.).
- `src/context/` — State providers like **SensoryContext** (TTS/Haptics).
- `src/lib/` — Shared logic (Supabase client, Auth helpers, Progress tracking).
- `supabase/` — Database migrations and seed data.

## 🔐 Authentication & Roles

### Supabase Auth
The platform uses Supabase Auth for standard users (CHILD, PARENT). Roles are stored in the `public.profiles` table and checked via middleware.

### Admin Bypass
For the MVP, an **Admin Bypass** is implemented using environment variables.
- Sign-in logic in `src/app/sign-in/page.js` checks against `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- If matched, an `admin_session` cookie is set.
- `middleware.js` allows access to `/dashboard/admin` if this cookie is present.

## 📊 Progress Tracking

### Module IDs
The system uses a hybrid approach for module identification:
1. **Local IDs**: Human-readable strings (e.g., `num-1`) used in the frontend `modules-data.js` for metadata (SVGs, TTS prompts).
2. **Database UUIDs**: Primary keys in the Supabase `modules` table.

The `updateStudentProgress()` helper in `src/lib/progress.js` resolves the Database UUID from the Local ID by matching the module title before performing an `upsert`.

## 🔊 Sensory System

Implemented via `SensoryContext.js`, providing two core hooks:
1. `narrate(text)`: Uses `speechSynthesis` at 0.7x speed with a friendly pitch.
2. `pulse(pattern)`: Triggers `navigator.vibrate` for tactile confirmation of correct answers.

## 🎨 Design System

LearnSpark uses a custom **Claymorphism** design system defined in `src/app/globals.css` and powered by Tailwind CSS v4 tokens.
- `shadow-clay`: Custom multi-stop shadows for the "squishy" card look.
- `glass`: Frosted glass variants for tooltips and headers.
