<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Investment Portfolio Tracker

A client-heavy SPA for tracking investment portfolios, built with TanStack Start. Migrated from a Next.js App Router application.

## Quick Reference

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Type-check (tsc --noEmit) then Vite build
npm run preview      # Preview production build
npm run test         # Run vitest
npm run check        # Biome lint + format check
npm run lint         # Biome lint only
npm run format       # Biome format only
```

## Stack

| Layer         | Technology                                                |
| ------------- | --------------------------------------------------------- |
| Framework     | TanStack Start (`@tanstack/react-start`)                  |
| Router        | TanStack Router (`@tanstack/react-router`) — file-based   |
| Data fetching | TanStack Query (`@tanstack/react-query`) + axios          |
| Tables        | TanStack Table (`@tanstack/react-table`)                  |
| Toolchain     | Biome 2 (lint + format)                                   |
| Bundler       | Vite 8                                                    |
| Styling       | Tailwind CSS 4 + shadcn/ui                                |
| Forms         | react-hook-form + zod validation schemas                  |
| Charts        | Recharts                                                  |
| Auth          | Google OAuth via `@react-oauth/google`                    |
| Monitoring    | Sentry (`@sentry/tanstackstart-react`) — DSN not yet set  |
| Package mgr   | npm                                                      |

## Architecture

- **Client-rendered SPA** — no server components or server functions. All data fetching via React Query + axios.
- **External API** at `http://localhost:5185/api` — a separate .NET backend, not part of this repo.
- **Auth flow**: Google OAuth token → stored in `localStorage` → sent as `Bearer` token via axios interceptor (`src/hooks/use-primal-api-client.ts`). On 401, token is cleared and user is redirected to `/`.
- **React Query persistence**: query cache persisted to `localStorage` via `@tanstack/query-async-storage-persister` (configured in `src/components/providers.tsx`).

## Project Structure

```
src/
├── routes/                    # File-based routes (TanStack Router)
│   ├── __root.tsx             # Root layout: HTML shell, sidebar, providers, devtools
│   ├── index.tsx              # / — home/login page
│   ├── asset-items/           # /asset-items/* routes
│   ├── portfolio/             # /portfolio route
│   └── portfolio-trends/      # /portfolio-trends route
├── features/                  # Feature modules (domain logic)
│   ├── asset-items/
│   │   ├── components/        # UI components (forms, tables, dialogs)
│   │   ├── hoc/               # withAssetItems HOC
│   │   ├── hooks/             # React Query hooks (queries + mutations)
│   │   ├── lib/               # Utilities
│   │   └── schema.ts          # Zod validation schema
│   ├── portfolio/
│   │   ├── components/        # Portfolio sections, charts, filters
│   │   ├── hoc/               # withValuations, withInvestmentsFilter, etc.
│   │   ├── hooks/             # Valuation queries
│   │   └── lib/               # Utilities
│   └── transactions/
│       ├── components/        # Add/edit forms, table, delete dialog
│       ├── hooks/             # Transaction queries + mutations
│       ├── lib/               # Utilities
│       └── schema.ts          # Zod validation schema
├── components/
│   ├── hoc/                   # Shared HOCs (withCurrency)
│   ├── ui/                    # shadcn/ui primitives
│   ├── providers.tsx          # GoogleOAuthProvider + query persistence setup
│   ├── app-sidebar.tsx        # Navigation sidebar
│   └── ...                    # Other shared components
├── hooks/                     # Shared hooks
│   ├── use-access-token.ts    # localStorage-backed access token
│   ├── use-primal-api-client.ts # Axios instance with auth interceptor
│   ├── use-log-in-mutation.ts
│   ├── use-log-out-mutation.ts
│   └── users.ts               # useUserQuery, useUpdateUserMutation
├── integrations/
│   └── tanstack-query/        # Query client setup + devtools
├── lib/
│   └── utils.ts               # cn() and shared utilities
├── types.ts                   # Domain enums and types
├── router.tsx                 # Router factory
└── routeTree.gen.ts           # Auto-generated — do NOT edit
```

## Route Map

| Path                                                        | File                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| `/`                                                         | `src/routes/index.tsx`                                                    |
| `/asset-items`                                              | `src/routes/asset-items/index.tsx`                                        |
| `/asset-items/add`                                          | `src/routes/asset-items/add.tsx`                                          |
| `/asset-items/:assetItemId`                                 | `src/routes/asset-items/$assetItemId.index.tsx`                           |
| `/asset-items/:assetItemId/transactions/add`                | `src/routes/asset-items/$assetItemId.transactions.add.tsx`                |
| `/asset-items/:assetItemId/transactions/:transactionId/edit`| `src/routes/asset-items/$assetItemId.transactions.$transactionId.edit.tsx` |
| `/portfolio`                                                | `src/routes/portfolio/index.tsx`                                          |
| `/portfolio-trends`                                         | `src/routes/portfolio-trends/index.tsx`                                   |

## Domain Types

Defined in `src/types.ts`:

- **Enums**: `Currency`, `Locale`, `AssetClass`, `AssetType`, `TransactionType`, `PortfolioType`
- **Entities**: `User`, `AssetItem`, `Transaction`, `Portfolio`, `Valuation`
- **Portfolio variants**: `OverallPortfolio`, `AssetClassPortfolio`, `AssetTypePortfolio`, `AssetItemPortfolio`

## Key Patterns

### HOC Composition

Data-fetching HOCs wrap components to inject loaded data. They handle loading/error states internally.

```tsx
// src/features/asset-items/hoc/with-asset-items.tsx
export default function withAssetItems<T extends { assetItems: AssetItem[] }>(
  Component: React.ComponentType<T>,
) { ... }

// Usage in route: export default withAssetItems(AssetItemsPage);
```

Available HOCs: `withAssetItems`, `withCurrency`, `withValuations`, `withAssetItemPortfolio`, `withAssetItemPortfolios`, `withInvestmentsFilter`, `withPortfolioTrendsSection`.

### React Query Hooks

Each feature has its own hooks file exporting query/mutation hooks:
- `src/features/asset-items/hooks/asset-items.ts` — `useAllAssetItemsQuery`, `useAddAssetItemMutation`, `useDeleteAssetItemMutation`, `refreshAssetItems`, `refreshAssetItem`
- `src/features/transactions/hooks/transactions.ts` — `useAssetItemTransactionsQuery`, `useTransactionQuery`, `useAddTransactionMutation`, `useEditTransactionMutation`, `useDeleteTransactionMutation`
- `src/features/portfolio/hooks/valuations.ts` — `useValuationsQueries` (default export, uses `useQueries` for parallel fetching)

Query key conventions: `["assetitems", ...]`, `["valuations", ...]`, `["users", "me"]`

### API Client

`usePrimalApiClient()` returns an axios instance configured with:
- Base URL: `http://localhost:5185/api`
- Auto-attached Bearer token from localStorage
- 401 interceptor that clears token and redirects

### Form Validation

Zod schemas in `src/features/*/schema.ts`, integrated via `@hookform/resolvers/zod` with react-hook-form. Schemas use `.superRefine()` for conditional validation based on asset type or transaction type.

### Path Aliases

Two aliases are configured (tsconfig `paths` + package.json `imports`):
- `#/*` → `./src/*`
- `@/*` → `./src/*`

The codebase exclusively uses `@/` — always use `@/` for imports.

## Code Style & Conventions

- **Formatter**: Biome — tabs for indentation, double quotes for strings
- **Lint**: Biome recommended rules
- **TypeScript**: strict mode, `verbatimModuleSyntax` enabled — always use `import type` for type-only imports
- **File naming**: kebab-case for all source files (e.g., `with-asset-items.tsx`, `use-access-token.ts`)
- **Component naming**: PascalCase for components, camelCase for hooks and utilities
- **No default exports** for non-route files; route files export `Route` via `createFileRoute`
- **Route tree**: `src/routeTree.gen.ts` is auto-generated by the TanStack Router Vite plugin — never edit manually

## Environment Variables

| Variable               | Required | Purpose                                  |
| ---------------------- | -------- | ---------------------------------------- |
| `VITE_GOOGLE_CLIENT_ID`| Yes      | Google OAuth client ID                   |

Set in `.env.local` (gitignored). The `.env` file contains an empty placeholder.

## Gotchas

1. **`verbatimModuleSyntax`** — enabled in tsconfig. Use `import type` for type-only imports or builds will fail / leak server code to client.
2. **Vite plugin order** — `tanstackStart()` MUST come before `viteReact()` in `vite.config.ts`.
3. **`<Scripts />` required** — the `<Scripts />` component must stay in the root route `<body>` or hydration breaks.
4. **Route path strings** — managed by the TanStack Router Vite plugin. Don't manually edit the path string in `createFileRoute('/...')`.
5. **Build = type-check + build** — `npm run build` runs `tsc --noEmit` before `vite build`.
6. **`routeTree.gen.ts`** — auto-generated, do not edit. It regenerates on dev server start and during build.
7. **External API dependency** — the app requires the .NET API running at `http://localhost:5185` for full functionality.

## Maintaining This File

Keep `AGENTS.md` in sync with the codebase. When you add, remove, or rename routes, features, hooks, environment variables, or change architectural patterns, update the relevant sections of this file as part of the same change.
