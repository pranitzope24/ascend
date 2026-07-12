<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ascend repository guide

Ascend is an offline-first habit tracker built as a mobile-first Next.js application. Preserve the feature-first architecture and the boundaries below when extending it.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS v4
- shadcn/ui using the `radix-maia` style
- Radix UI and Vaul for interactive primitives
- Zustand for client state
- Dexie/IndexedDB for offline persistence
- React Hook Form with Zod validation
- Lucide React icons
- `next-themes` for light/dark/system themes
- Local SF Pro font from `public/fonts/SF-Pro.ttf`

Use the versions already installed in `package.json`. Do not replace UI libraries or add another state, form, validation, or database library without a concrete need.

## Commands

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

Before handing off a change, run lint and a production build. Also run focused tests when a test suite is added.

## Project structure

```text
src/
  app/                    # App Router pages, layouts, and global CSS
  components/
    shared/               # Reusable application-level composition
    ui/                   # shadcn primitives; keep these generic
  db/                     # Dexie database and versioned schemas
  features/<feature>/     # Feature components, services, validation, types
  hooks/                  # Cross-feature React hooks
  store/                  # Zustand stores
  lib/                    # Framework-agnostic utilities
```

New domain work should normally live under `src/features/<feature>`. Avoid placing business logic in `src/app`, shared UI primitives, or React components.

## Architecture boundaries

Use this dependency flow:

```text
Page/component -> Zustand action -> feature service -> Dexie
```

- Components render state and invoke actions. They must not access Dexie directly.
- Zustand stores coordinate loading/error state and update in-memory state.
- Services contain persistence operations and domain-facing data access.
- Zod schemas own form validation; infer form types from the schema when practical.
- Keep reusable constants and domain types in the feature `types.ts`.
- Do not add future gamification, streak, analytics, notification, authentication, or sync logic while working on unrelated features.

Dexie runs in the browser. Any module importing or executing browser-only behavior must stay below a Client Component boundary. When changing a table or index, add a new Dexie version and migration rather than rewriting an existing released schema. IndexedDB does not support booleans as index keys.

## Next.js conventions

- Pages and layouts are Server Components by default.
- Add `"use client"` only at the smallest boundary that needs state, effects, event handlers, or browser APIs.
- Read the relevant local documentation under `node_modules/next/dist/docs/` before using or changing a Next.js API.
- Use the `@/` TypeScript alias for imports from `src`.
- Keep page files thin; compose feature-level page components rather than building features inside route files.

## UI and responsive conventions

Build mobile-first. Base classes target phones; use `sm:`, `md:`, and `lg:` only to enhance layouts as space becomes available.

- Wrap standard pages with `PageShell` and use `PageHeader` from `src/components/shared/page-shell.tsx`.
- Use `ResponsiveDialog` from `src/components/shared/responsive-dialog.tsx` for forms and focused overlays. It renders a bottom drawer below 768px and a centered dialog on desktop.
- Keep overlay open state controlled by the feature. Pass feature content, title, description, optional trigger, and footer into `ResponsiveDialog`; do not duplicate media-query branching.
- Use `dvh` and `env(safe-area-inset-*)` for viewport-height and mobile inset behavior.
- Prefer flexible grids, wrapping, `min-w-0`, and responsive max widths over fixed widths.
- Preserve touch targets of roughly 44px on coarse-pointer devices.
- Ensure long titles and user-provided content wrap or truncate intentionally.
- Use semantic HTML, labels, visible validation errors, keyboard-accessible primitives, and meaningful `aria-label` text for icon-only buttons.

Keep `src/components/ui` aligned with the installed shadcn style. Compose those primitives in `components/shared` or feature components instead of adding feature behavior to the primitives themselves. This repository currently uses Radix-style `asChild` composition, not Base UI's `render` prop.

## Forms

- Use React Hook Form with `zodResolver`.
- Render labels and errors with the shadcn `Field` components.
- Reuse a single form for create/edit flows when the fields are the same.
- Keep submission logic in a store action; the form may handle pending state and map failures to a root error.
- Buttons outside a scrolling form should target it using a stable form `id`.

## Styling

- Global tokens and mobile interaction defaults live in `src/app/globals.css`.
- Use theme tokens such as `bg-background`, `text-foreground`, `text-muted-foreground`, and `bg-primary` instead of hard-coded theme colors.
- Use the `cn` helper for conditional class composition.
- SF Pro is the primary sans and heading font; Geist Mono is the monospace font.
- Do not add animations or visual polish unless the task calls for them.

## Habit module notes

- Active habits are displayed at `/` and `/habits`.
- Habit create/edit uses `HabitFormDialog` and `ResponsiveDialog`.
- Archiving is the normal removal action. Permanent deletion exists at the store/service layer but should only be exposed through explicit destructive UI.
- Difficulty supplies a default XP value, but users may override it.
- Categories and difficulty values are shared constants in `src/features/habits/types.ts`.
- Habit logs are scaffolded only; completion and streak logic are intentionally not implemented yet.

## Change discipline

- Preserve user changes and avoid unrelated rewrites.
- Keep files focused and prefer composition over large components.
- Avoid speculative abstractions; extract a shared component when at least one concrete pattern benefits from it.
- Do not silently change database semantics, URLs, design tokens, or public store actions.
- Update this guide when introducing a new repository-wide convention.
