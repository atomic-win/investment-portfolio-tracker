<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Investment Portfolio Tracker — TanStack Start

## Scaffold Command

```bash
npx @tanstack/cli@latest create investment-portfolio-tracker-tanstack \
  --agent --package-manager npm --toolchain biome \
  --add-ons neon,drizzle,sentry,better-auth,tanstack-query
```

## TanStack Intent Commands

```bash
npx @tanstack/intent@latest install
npx @tanstack/intent@latest list
npx @tanstack/intent@latest load @tanstack/react-start#lifecycle/migrate-from-nextjs
npx @tanstack/intent@latest load @tanstack/router-core#router-core
npx @tanstack/intent@latest load @tanstack/start-client-core#start-core
```

## Stack & Integrations

| Layer           | Technology                                      |
| --------------- | ----------------------------------------------- |
| Framework       | TanStack Start (`@tanstack/react-start`)        |
| Router          | TanStack Router (`@tanstack/react-router`)      |
| Data fetching   | TanStack Query (`@tanstack/react-query`) + axios |
| Tables          | TanStack Table (`@tanstack/react-table`)        |
| Toolchain       | Biome (lint + format)                           |
| Bundler         | Vite 8                                          |
| Styling         | Tailwind CSS 4 + shadcn/ui components           |
| Forms           | react-hook-form + zod                           |
| Charts          | Recharts                                        |
| Auth (client)   | Google OAuth (`@react-oauth/google`)            |
| Auth (scaffold) | Better Auth (scaffolded, not yet active)        |
| Database        | Neon + Drizzle ORM (scaffolded, not yet active) |
| Monitoring      | Sentry (`@sentry/tanstackstart-react`)          |
| Package manager | npm                                             |

## Project Origin

Migrated from a Next.js 16 App Router application. The legacy source is preserved in `./legacy-source/` for reference only.

## Architecture

- **Client-heavy SPA** — all data fetching via React Query + axios to an external API
- **External API** at `http://localhost:5185/api` — not part of this project
- **Auth**: Google OAuth token stored in localStorage, sent as Bearer token
- **No server components or server functions** — the app is fully client-rendered
- **HOC composition pattern** — `withAssetItems`, `withCurrency`, `withValuations`, etc.
- **File-based routing** via TanStack Router in `src/routes/`

## Route Map

| Path                                                        | File                                                                         |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `/`                                                         | `src/routes/index.tsx`                                                       |
| `/assetitems`                                               | `src/routes/assetitems/index.tsx`                                            |
| `/assetitems/add`                                           | `src/routes/assetitems/add.tsx`                                              |
| `/assetitems/:assetItemId`                                  | `src/routes/assetitems/$assetItemId.index.tsx`                               |
| `/assetitems/:assetItemId/transactions/add`                 | `src/routes/assetitems/$assetItemId.transactions.add.tsx`                    |
| `/assetitems/:assetItemId/transactions/:transactionId/edit` | `src/routes/assetitems/$assetItemId.transactions.$transactionId.edit.tsx`    |
| `/portfolio`                                                | `src/routes/portfolio/index.tsx`                                             |
| `/portfolio-trends`                                         | `src/routes/portfolio-trends/index.tsx`                                      |

## Environment Variables

| Variable             | Required | Purpose                                    |
| -------------------- | -------- | ------------------------------------------ |
| `DATABASE_URL`       | No*      | Neon database connection (scaffold add-on)  |
| `DATABASE_URL_POOLER`| No*      | Neon pooled connection (scaffold add-on)    |
| `VITE_SENTRY_DSN`    | No       | Sentry error tracking DSN                  |
| `GOOGLE_CLIENT_ID`   | No**     | Currently hardcoded in Providers.tsx        |

\* Database is scaffolded but not used by the migrated app yet.
\*\* The Google Client ID is currently hardcoded. Move to `VITE_GOOGLE_CLIENT_ID` env var when ready.

## Key Architectural Decisions

1. **Kept Google OAuth via `@react-oauth/google`** instead of Better Auth — the legacy app uses a custom backend auth flow, not Better Auth's built-in providers.
2. **Kept axios + localStorage token pattern** — the app talks to an external .NET API; server functions aren't needed.
3. **No parallel routes / intercepting routes** — Next.js `@modal/(.)add` pattern was flattened to regular routes. Modal UX for add/edit can be re-added using TanStack Router's route masking if desired.
4. **React Query persistence** — client-side localStorage persistence via `@tanstack/query-async-storage-persister`.
5. **Search params** — `useSearch({ strict: false })` replaces Next.js `useSearchParams` for portfolio filters and trend tabs.

## Known Gotchas

1. **verbatimModuleSyntax** — enabled in tsconfig. Use `import type` for type-only imports or builds will leak server code to client.
2. **Vite plugin order** — `tanstackStart()` MUST come before `viteReact()` in vite.config.ts.
3. **No `<Scripts />` = no hydration** — the `<Scripts />` component must stay in the root route `<body>`.
4. **Route path strings** — managed by the TanStack Router Vite plugin. Don't edit `createFileRoute('/...')` path strings manually.
5. **Build includes type checking** — `npm run build` runs `tsc --noEmit` before `vite build`.

## Next Steps

- [ ] Extract hardcoded Google Client ID to `VITE_GOOGLE_CLIENT_ID` env var
- [ ] Re-implement modal UX for add/edit asset items and transactions using TanStack Router route masking
- [ ] Configure Neon database + Drizzle ORM for server-side data if migrating away from external API
- [ ] Set up Better Auth if switching from Google OAuth to a full auth solution
- [ ] Add Sentry DSN for error tracking
- [ ] Add tests (vitest is configured)
- [ ] Configure deployment (see `start-core/deployment` skill)
