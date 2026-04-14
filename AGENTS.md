## Learned User Preferences
- Prefer Thai for explanations and troubleshooting guidance.
- Prefer using the latest available tool/dependency versions when setting up or updating project tooling.
- Prefer direct, hands-on fixes (making file edits/commands) when asking for implementation help.

## Learned Workspace Facts
- `truncate-smart` is a TypeScript-first string truncation library with zero runtime dependencies.
- The workspace follows `CLAUDE.md` conventions, including strict TypeScript and small single-purpose modules under `src/`.
- Standard verification gate is `pnpm typecheck && pnpm test && pnpm lint && pnpm build`.
- Package publishing targets npm scope `@amiearth/truncate-smart`.
- GitHub Actions publish flow is defined in `.github/workflows/publish.yml` and uses release tags (`v*.*.*`) plus manual dispatch.
