# Contributing to Nocta UI

Thanks for helping improve Nocta UI! This guide explains how the library is organised, how to work with the design tokens, what commands are available, and how we approach accessibility.

## Table of Contents

- [Project Overview](#project-overview)
- [Environment Setup](#environment-setup)
- [Project Commands](#project-commands)
- [Git Workflow & Pre-Commit Hooks](#git-workflow--pre-commit-hooks)
- [Component Architecture](#component-architecture)
- [Working With Design Tokens](#working-with-design-tokens)
- [CLI Registry Integration](#cli-registry-integration)
- [Updating Documentation](#updating-documentation)
- [Accessibility (a11y) Expectations](#accessibility-a11y-expectations)
- [Pull Request Checklist](#pull-request-checklist)
- [Need Help?](#need-help)

## Project Overview

- **Framework**: Next.js App Router with React 19 and Tailwind CSS v4 presets (`@import "tailwindcss"`).
- **Documentation site**: Built with [fumadocs](https://fumadocs.vercel.app). MDX sources live under `content/docs`.
- **Component philosophy**: Copy-paste components that wrap accessible headless primitives (`@ariakit/react`).
- **Distribution**: The Nocta CLI fetches component source code and styling tokens directly from this repository’s `public/registry` directory.

## Environment Setup

1. Install dependencies (we recommend `pnpm`, since the repo includes a `pnpm-lock.yaml`):

   ```bash
   pnpm install
   ```

2. Start the documentation site locally:

   ```bash
   pnpm dev
   ```

   The site runs on `http://localhost:3000` by default. Component demos and accessibility behaviour can be tested there.

3. Build production output when needed:

   ```bash
   pnpm build
   ```

## Project Commands

All commands are declared in `package.json`.

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Run the Next.js dev server for docs and demos. |
| `pnpm build` | Build the production bundle for the docs app. |
| `pnpm lint` | Run Biome (`biome check .`) to lint and format the codebase. |
| `pnpm lint:fix` | Apply Biome auto-fixes. |
| `pnpm typecheck` | Type-check the Next.js app (`tsconfig.json`). |
| `pnpm prepare` | Installs Husky Git hooks (executed automatically by package managers that honour the `prepare` script). |

Useful helper scripts:

- `scripts/sync-css-tokens.sh`: Copies design tokens from `app/global.css` into `public/registry/css/index.css` for CLI consumption.
- `scripts/sync-icons.sh`: Synchronizes `registry/lib/icons.ts` with `public/registry/lib/icons.ts` for CLI consumption.
- `scripts/build-components.sh`: Regenerates `public/registry/components.json` by Base64-encoding source components. Automatically fixes import paths before encoding.

Both scripts run automatically before every commit (see below), but you can execute them manually whenever you need to refresh the registry outputs.

## Git Workflow & Pre-Commit Hooks

We use Husky to keep the registry in sync:

```sh
.husky/pre-commit
└── bash ./scripts/sync-css-tokens.sh
    bash ./scripts/build-components.sh
    bash ./scripts/sync-icons.sh
    git add public/registry/components.json public/registry/css/index.css public/registry/lib/icons.ts
```

- **Never bypass the hook** unless you know exactly what you are doing—registry files must stay aligned with the source.
- If you run into issues during development you can run the same scripts manually to diagnose problems.

## Component Architecture

All distributable components live in `registry/ui` with component demos in `demos/`

Key conventions:

- **Client components**: Most UI elements opt into the React Client Component model (`'use client';`) because they rely on interactivity or hooks from `@ariakit/react`.
- **Accessible primitives**: Wrap primitives from `@ariakit/react` (dialogs, tooltips, tabs, etc.). Follow their accessibility contract and expose ergonomic props on top.
- **Variants & styling**: Use `class-variance-authority` (`cva`) alongside the `cn` helper (`lib/utils.ts`) to express visual variants. Token-aware Tailwind utility classes (`bg-card`, `text-foreground`, `shadow-lg`, etc.) ensure consistent styling.
- **Demos**: Keep `*-demos.tsx` small and focused. They render within documentation pages and help both design and a11y reviews.

When adding or refactoring components:

1. Start from an accessible primitive and preserve its focus management, keyboard interactions, and ARIA semantics.
2. Use existing tokens (`text-foreground`, `border-border`, etc.) instead of hard-coded Tailwind colours.
3. Provide sensible defaults through `cva` `defaultVariants`.
4. Export typings (`type ButtonProps`) so downstream projects get IntelliSense.
5. Write demos that showcase each variant/state (default, destructive, loading, etc.).

## Working With Design Tokens

The canonical token definitions live in `app/global.css`:

- `:root` contains the light theme values (colours, shadows, radii).
- `.dark` overrides define the dark mode palette.
- Tailwind `@theme` blocks map CSS custom properties (e.g. `--color-background`) to utility aliases (`bg-background`, `text-foreground`).

Whenever tokens change:

1. Update `app/global.css` (both light and dark values where appropriate).
2. Execute `bash scripts/sync-css-tokens.sh` (or just commit and let the pre-commit hook run). This regenerates `public/registry/css/index.css` so the CLI sees the latest tokens.

**Important**: `public/registry/css/index.css` must remain free of banners or comments—the sync script copies only the token blocks to keep the file consumable by the CLI.

## CLI Registry Integration

The Nocta CLI fetches everything it needs from `public/registry`:

- `public/registry/components.json`: a map of `ComponentFileName -> Base64(Source)`.
- `public/registry/css/index.css`: theme tokens consumed during `npx @nocta-ui/cli init`.
- `public/registry/registry.json`: the manifest that declares available components, their metadata, and category placement.

`scripts/build-components.sh` controls the JSON artefact:

1. Collects every `.tsx` file under `registry/ui/**`.
2. Applies a Perl-based fix so imports (`@/registry/ui/[componentName]`) are rewritten to (`@/components/ui/[componentName]`)n.
3. Base64-encodes the content and writes the map.

Whenever you add, rename, or delete components, run this script (or rely on the pre-commit hook) so the CLI stays in sync.

For `registry.json` updates:

1. Create or update the component entry inside the top-level `components` map. Populate fields such as `name`, `description`, `category`, `files`, `dependencies`, `exports`, `props`, and any `variants`/`sizes`. Use existing entries as references.
2. Add the component slug to the correct category array in the `categories` section (at the bottom of the file). The CLI relies on both the component object and the category list.
3. Validate your structure against `public/registry/schema/registry-schema.json` (your editor may support JSON Schema validation automatically).

> The CLI reads `registry.json` to know what it can scaffold. Missing or malformed entries will prevent the new component from appearing in `npx @nocta-ui/cli add` and `npx @nocta-ui/cli list`.

## Updating Documentation

Component docs live in `content/docs`. Each component usually has an MDX file at `content/docs/<component>.mdx` and may contribute examples to the `docs` layout in `components/`.

When introducing a new component:

1. Add or update the MDX documentation under `content/docs`. Use the existing pages as references for structure and tone.
2. Import your demo components from `demos/`.
3. Register the documentation page in `content/docs/meta.json` under the appropriate category heading (e.g. `"---Form---"`). This controls sidebar grouping.
4. Run `pnpm dev` and verify the documentation renders correctly.

> Remember to keep `content/docs/meta.json`, and `public/registry/registry.json` aligned so the CLI, and registry all agree on the new component’s name and category.

## Accessibility (a11y) Expectations

Accessibility is a core value of the library. Follow these practices:

- **Keyboard support**: Verify every interactive element is reachable and operable via keyboard only (Tab, Shift+Tab, Arrow keys when applicable, Escape for dismissals).
- **Focus management**: Ensure focus moves predictably when dialogs, menus, or other overlays open/close. Ariakit primitives help, but custom logic must preserve focus ordering.
- **ARIA attributes**: Export appropriate `aria-*` props from components and pass them through to the underlying primitive. Use roles (`role="alert"`, `aria-live`, etc.) as required.
- **Visual feedback**: Use existing focus and state tokens to provide visible focus indicators and state changes.
- **Screen reader review**: Run through flows with a screen reader (VoiceOver, NVDA, or JAWS). Confirm announcements match expectations.
- **Automated tooling** (recommended): Install an Axe browser extension or use the React Testing Library + `jest-axe` combo in manual testing to catch regressions. Even though we do not yet ship automated a11y tests, contributors are encouraged to validate components with these tools locally.
- **Demos parity**: Keep documentation demos representative of real usage so design/a11y reviewers can exercise every state.

## Pull Request Checklist

Before opening a PR, please:

1. Run `pnpm lint` and ensure Biome passes.
2. Run `pnpm typecheck``.
3. Run (or rely on pre-commit to run) `scripts/sync-css-tokens.sh`, `scripts/sync-css-icons.sh` `scripts/build-components.sh` if you touched tokens, icons or components.
4. Manually verify a11y-critical interactions in the docs site (keyboard + screen reader spot checks).
5. Update or add MDX docs and demos where relevant.
6. Include screenshots or GIFs in the PR description when visual changes are significant.

## Need Help?

- Open a discussion or issue if anything in this guide is unclear.
- Tag maintainers on Discord/GitHub for architectural questions or a11y reviews.
- We welcome suggestions to automate more of the accessibility and registry workflows—feel free to start a proposal issue using the templates below.

Thanks again for contributing to Nocta UI!
