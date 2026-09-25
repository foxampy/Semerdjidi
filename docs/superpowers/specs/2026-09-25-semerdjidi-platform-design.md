# Semerdjidi Platform — Design Spec

> **Note on process:** by explicit user instruction this spec is written *in parallel* with
> implementation, not before it ("пиши параллельно спек и разрабатывай и выгружай главные
> страницы... и деплой по готовности каждого модуля постоянно, чтобы я уже параллельно
> смотрел и правки расписывал"). This is a deliberate, requested deviation from the normal
> brainstorming-before-code sequence. Sections below describe what has actually been built;
> they are updated as new modules ship, not written speculatively ahead of the code.

## 1. Goal

Build a full platform for the Semerdjidi psychology/psychoanalysis center in Tashkent:

- Responsive web app at `semerdjidi.web.app` (mobile + desktop)
- Telegram Mini App (same product surface, adapted shell)
- Telegram Bot (lead capture / FAQ / booking entry point)
- Supabase backend (leads, bookings, comments, auth)
- Sales-funnel focus: personal and corporate/commercial analysis services, complexes of
  analytics/therapy/practice/retreat programs across 1/3/6/9/12+ month horizons, standalone
  module apps, and specialist search/matching.

## 2. Decomposition into sub-projects

The brief covers multiple independent subsystems. Build order, in dependency order:

1. **Web platform (this spec's primary subject, in progress)** — static Next.js site on
   Firebase Hosting, brandbook-driven design, full content model (programs, specialists,
   retreats, journal, test, partners), booking UI. No backend yet — forms are UI-complete but
   not wired to storage.
2. **Supabase backend** (not started) — schema for bookings/leads, auth (if needed for a
   client portal later), possibly reusing the existing `vodeco` Supabase project's patterns
   (Edge Functions for moderated writes, RLS-gated reads) established on the EvenEsh site,
   or a dedicated new Supabase project for Semerdjidi. **Open decision, to be confirmed with
   the user before starting:** new project vs. reuse.
3. **Telegram Mini App** (not started) — thin wrapper reusing the same Next.js pages/content
   inside Telegram's WebView, once the web platform and backend are stable.
4. **Telegram Bot** (not started) — lead intake + FAQ + handoff to Mini App / booking form,
   built after the backend exists (bot needs somewhere to write leads to).
5. **Specialist search/matching module** (partially started) — currently a static test
   (`/test`) that recommends a *program tier*, not yet a specialist-matching engine. Full
   matching logic (structured intake → specialist recommendation) is future work once real
   specialist availability/capacity data exists in the backend.

This document tracks subsystem 1 in detail; subsystems 2–5 get their own specs when their
turn comes, per the decomposition principle.

## 3. Tech stack (web platform)

- Next.js 15, App Router, `output: 'export'` (fully static — matches EvenEsh's own hosting
  model and Firebase Hosting's static-file serving).
- React 19, TypeScript strict, Tailwind v4 via `@tailwindcss/postcss` (config-in-CSS, no
  `tailwind.config.js`).
- Firebase Hosting, project `semerdjidi`, single hosting site → `semerdjidi.web.app`.
- `@supabase/supabase-js` is already a declared dependency (unused until subsystem 2 lands).
- Google Fonts loaded via direct `<link>` (CSS2 API), not `next/font/google` — the installed
  Next version's bundled Newsreader metadata has no `cyrillic` subset, and the site is fully
  Russian. Mirrors the pattern already used in the approved HTML mockup `2.html`.

## 4. Design system

Source of truth: `DESIGN.md` ("Deep Forest Biomorphic & Contemplative Science") plus the
approved HTML mockups and брендбук assets, cross-checked line-by-line — no divergence found,
so `app/globals.css` encodes the tokens directly as a Tailwind v4 `@theme` block:

- Dark-only M3-style palette: surface/primary/secondary/tertiary families with container and
  on-* variants, plus 5 raw brand colors (olive/sage/linen/clay/umber) reserved for logo/accent
  use only.
- Typography: Newsreader (display/body), Space Mono (labels, uppercase, letter-spaced).
- Utility classes: `.label-caps`, `.surface-card`, `.glow-moss`, `.hairline`, `.btn-primary`,
  `.btn-ghost` — used consistently across every page built so far instead of one-off styles.

## 5. Content model

All content lives in typed `content/*.ts` files (`types.ts` is the single source of truth for
shapes), following the same content-as-data pattern as the EvenEsh main site:

- `content/specialists.ts` — 4 specialists, bios ported from the legacy repo2 data, re-typed.
- `content/programs.ts` — three tiers of catalog data:
  - `PROGRAMS`: discrete offerings (individual therapy, group dynamics, qualification course,
    retreat, supervision, corporate audit, and the AMAImedia-linked personalized language
    model product).
  - `FULL_PROGRAM_PLANS`: five fixed-composition tracks at 1/3/6/9/12 months, each with an
    exact count of individual sessions/group sessions/retreats/supervisions/lectures per
    phase and total+per-month pricing — this is the direct answer to the "1-3-6-9-12 и более
    месяцев" requirement, not an abstract description.
  - `COLLECTIVE_MODULES`: six expansion modules (couples/family/team/business/corporation/
    pets) — the direct answer to "модулей расширения на пара, семья... кампания, компания,
    животные". `pets` was added as a new `CollectiveCategory` member beyond what the legacy
    repo had, to ground the "animals" module request concretely rather than leaving it vague.
- `content/retreats.ts` — 2 retreats with day-by-day programs.
- `content/journal.ts` — 3 articles + 2 research papers (one of the papers explicitly
  attributed to the UIC collaboration).
- `content/test.ts` — 6-question personal-environment assessment, domain-tagged.
- `lib/site.ts` — single source for site metadata, nav, footer links, and the **partners**
  list: UIC, Realting.uz, UNICAP Invest, AMAImedia (only these four — no partnership is
  listed unless the user has confirmed it as fact).

**Scope decisions made along the way:**
- No photo/image fields on `Specialist` — no real photography exists yet, so avatars are
  rendered as initials rather than inventing placeholder imagery.
- The "personalized language model" idea from the brief was deliberately grounded into one
  concrete catalog entry (`prog-personal-ai-model`, tied explicitly to AMAImedia) plus the
  `pets` collective module, instead of open-ended speculative product copy.

## 6. Pages shipped so far

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ deployed | Hero, method chain, program/specialist/retreat teasers, test CTA, partner strip |
| `/programs` | ✅ deployed | Full catalog by category, 1–12mo plan cards, collective modules grid |
| `/specialists` | ✅ deployed | Full specialist profiles, linked to their programs |
| `/partners` | ✅ deployed | Partner cards + AMAImedia/AI-model callout |
| `/retreats` | ✅ deployed | Full retreat detail cards with day-by-day program |
| `/journal` | ✅ deployed | Full articles + research papers inline (no dynamic `[slug]` routes yet — content volume doesn't justify it) |
| `/test` | ✅ deployed | Client-side 6-question quiz → score-banded recommendation (consultation / 3-month track / retreat) |
| `/booking` | ✅ deployed | Form UI complete; submission is **not yet wired to a backend** — clearly marked with a `TODO` in `BookingForm.tsx` pending subsystem 2 (Supabase) |
| `/onboarding` | ✅ deployed | 3-step flow: intro → method → path picker (individual / couple-family-team / corporate) routing into the rest of the site |

Not yet built: `/about`, `/contacts`, `/whitepaper`, `/healthy-company` (all referenced from
nav/footer already — placeholders to be filled in the next iteration).

## 7. Deployment

- Firebase project `semerdjidi` created; `firebase.json` + `.firebaserc` configured with a
  single hosting target (`out` directory, cache headers mirroring EvenEsh's proven config).
- Deployed and live at **https://semerdjidi.web.app** after each module lands, per the
  user's explicit "деплой по готовности каждого модуля постоянно" instruction.

## 8. Open questions for the user

1. Supabase: reuse the existing `vodeco` project (adding new tables/functions there) or spin
   up a dedicated Supabase project for Semerdjidi?
2. Booking form destination: plain leads table, or should it also trigger a Telegram
   notification (via bot) once the bot exists?
3. `/whitepaper` — confirm scope: is this strictly the investment/architecture material that
   was explicitly moved out of the main narrative earlier, or should it also include the
   AI-model product's technical description?
4. Specialist-matching: should `/test` eventually branch into specialist recommendations (not
   just program-tier recommendations) once specialist capacity data exists?
