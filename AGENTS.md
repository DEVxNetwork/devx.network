# Agent Guidelines for DEVx.network

## Build/Lint/Test Commands

- **Dev server**: `bun run dev` (Astro, http://localhost:3000)
- **Build**: `bun run build` (static site written to `dist/`)
- **Preview**: `bun run preview`
- **Lint**: `bun run lint` (ESLint + Prettier)
- **Format**: `bun run format` (auto-formats with Prettier)
- **Type check**: `bunx tsc --noEmit` (no test framework configured)

## Code Style Guidelines

- **Formatting**: Use tabs, no semicolons, double quotes, 100 char line width
- **React**: Functional components only. Interactive UI is a React island (`client:load`) inside an Astro page
- **Imports**: Prefer named imports, use @ alias for project root imports
- **TypeScript**: Strict mode enabled, use explicit types for props and state
- **Styling**: Use styled-components exclusively (NO Tailwind)
- **State**: Use React hooks (useState, useEffect), avoid class components
- **Async**: Use async/await over promises, handle errors with try/catch
- **File naming**: PascalCase for components (Footer.tsx), camelCase for utilities
- **Exports**: Named exports for components
- **Pages**: Astro files in `src/pages`. Shared React UI stays in `app/`
- **Data**: Static. Events live in `app/data/events.json`. No accounts, no database, no Supabase

## Documentation Index

### Project Setup

- **[README.md](./README.md)** - When to read: Initial project setup and contribution guidelines. Summary: Development setup, installation, and contribution workflow.

### Code Conventions

- **[docs/conventions/file-conventions.md](./docs/conventions/file-conventions.md)** - When to read: Before creating or refactoring any code files. Summary: Four-section file structure (types, constants, components, functions) with exports-first ordering, clean comment headers, and utils separation.
- **[docs/conventions/styling-guidelines.md](./docs/conventions/styling-guidelines.md)** - When to read: When working with styles. Summary: Styled-components usage and naming conventions.
