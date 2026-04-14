# CLAUDE.md — truncate-smart

Guidance for AI assistants and contributors working on this repo.

## Goals

- **Correctness first**: every behavior in the README and edge-case table should have a Vitest test.
- **Zero runtime dependencies** — only `devDependencies` for tooling.
- **Strict TypeScript** — no `any`; prefer `unknown` + narrowing.
- **Small modules** — one concern per file under `src/`.

## Layout

| File                     | Role                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| `src/truncate.ts`        | Main `truncate()` orchestration                                  |
| `src/segmenter.ts`       | `Intl.Segmenter` + fallbacks, grapheme helpers, whitespace index |
| `src/stripHtml.ts`       | Regex HTML tag removal                                           |
| `src/types.ts`           | `TruncateOptions`                                                |
| `src/createTruncator.ts` | Factory                                                          |
| `src/truncateAll.ts`     | Array helper                                                     |
| `src/index.ts`           | Public exports only                                              |

## Conventions

- Use `const` unless reassignment is required.
- Export types with `export type { ... }` from `src/index.ts` where applicable.
- Prefer early returns; avoid deep nesting.
- Keep imports at the top of the file (no inline imports).
- When changing truncation rules, update **tests first** or in the same change.

## Verification

Before finishing a task:

```bash
pnpm typecheck && pnpm test && pnpm lint && pnpm build
```

## Publishing

Build output lives in `dist/`. The `files` field in `package.json` includes only `dist`.
