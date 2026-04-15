## Learned User Preferences
- Prefer Thai for explanations and troubleshooting guidance.
- Prefer using the latest available tool/dependency versions when setting up or updating project tooling.
- Prefer direct, hands-on fixes (making file edits/commands) when asking for implementation help.

## Learned Workspace Facts
- `truncate-smart` is a TypeScript-first string truncation library with zero runtime dependencies.
- The workspace follows `CLAUDE.md` conventions, including strict TypeScript and small single-purpose modules under `src/`.
- Standard verification gate is `pnpm typecheck && pnpm test && pnpm lint && pnpm build`.
- Package publishing targets npm scope `@amiearth/truncate-smart`.
- GitHub Actions publish flow is in `.github/workflows/publish.yml` (tags `v*.*.*` and manual dispatch); local version bumps use `pnpm release:patch|minor|major` via `release.sh`, then push the matching tag.
- Continuous integration for pushes to `main` and pull requests is in `.github/workflows/ci.yml` and runs `pnpm typecheck && pnpm test:coverage && pnpm lint && pnpm build` (Vitest coverage thresholds apply).
