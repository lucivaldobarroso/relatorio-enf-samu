# Architecture

## Overview

The system is a client-side SPA for USA SAMU 192 checklist operations.

- `src/pages/Login.tsx`: access and registration flow
- `src/pages/Dashboard.tsx`: checklist execution, CME mode, history and stats
- `src/services/samuService.ts`: data access and business rules against Supabase
- `src/components/samu/*`: operational UI components by domain

## Runtime flow

1. User authenticates on Login page.
2. Session is persisted in `localStorage` by `useSession`.
3. On reload, session keeps user identity/VTR and resets selected turn (`turno`).
4. Dashboard loads checklist config and current VTR/turn data.
4. User saves item/section payloads to `submits_checklist`.
5. History and statistics are calculated from `logs_acesso` and `submits_checklist`.

## Layering

- Presentation: `src/components`, `src/pages`
- Session/state: `src/hooks/useSession.ts`
- Domain/data: `src/services/samuService.ts`
- Platform: `src/lib/supabase.ts`

## Data model (main tables)

- `servidores`: identity, role, password setup
- `vtrs`: available vehicles
- `config_checklist`: checklist baseline (section/item/default quantity)
- `submits_checklist`: checklist submissions per item
- `logs_acesso`: access logs by user and VTR

## Architectural decisions

- Supabase client-side access for fast deployment and simple ops.
- Strongly typed front-end with TypeScript.
- Business rules consolidated in service layer to keep page components thinner.
- Mobile-first behavior in dashboard (`100dvh`, sticky top bar, responsive sidebar).
- GitHub Pages deployment with Vite `base=/checklist/` and static redirect entry (`samu.html`).

## Domain rules reflected in service layer

- Completion is calculated by selected turn and VTR context.
- `NOITE` shift keeps continuity across midnight window (18:00 -> 06:00).
- `INDISPONIVEL CME` items are excluded from pending counts.
- Role-aware metrics use applicable sections (role + team sections).

## Risks and next improvements

- `samuService.ts` is getting large; split by domains (`authService`, `checklistService`, `statsService`).
- Add integration tests for service methods with mocked Supabase.
- Add route-level guards to avoid duplicated auth checks.
- Introduce schema validation (`zod`) at service boundaries.
