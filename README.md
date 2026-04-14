# truncate-smart

Zero-dependency, TypeScript-first string truncation. Handles word boundaries (including Thai/CJK via `Intl.Segmenter`), optional HTML tag stripping, grapheme-safe emoji boundaries, and protected substrings.

## Install

```bash
pnpm add truncate-smart
```

## Quick start

```ts
import { truncate, createTruncator, truncateAll, stripHtml } from "truncate-smart"

truncate("Hello world today", 14)
// => "Hello world..."

truncate("<p>Hello <b>world</b></p>", 10, { stripHtml: true })
// => "Hello..."

truncate("👨‍👩‍👧 family", 12)
// Grapheme-safe: does not split the ZWJ family emoji

truncate("日本語の文章です", 10, { locale: "ja" })
// Word-aware when a BCP-47 locale is set

const t = createTruncator({ suffix: "…", locale: "th" })
t("สวัสดีครับ", 8)

truncateAll(["one", "two three"], 6)
// => ["one", "two..."]
```

## API

### `truncate(str, maxLength, options?)`

- **`str`**: `string | null | undefined` — `null`/`undefined` are treated as empty.
- **`maxLength`**: Non-negative integer length budget for the **entire returned string** (content + suffix). When `emojiSafe` is `true` (default), length is measured in **grapheme clusters** (via `Intl.Segmenter` when available).
- **`options`**: See below.

Returns the truncated string. If the input is only whitespace (after optional HTML strip), returns `""`. If `maxLength` is less than or equal to the suffix length (in the same units as above), returns the suffix only (never throws).

### `createTruncator(defaults)`

Returns `(str, maxLength) => string` with fixed default options.

### `truncateAll(strs, maxLength, options?)`

Maps `truncate` over an array.

### `stripHtml(str)`

Removes `<...>` tags with a small regex — not a full HTML parser.

## Options

| Option          | Type       | Default | Description                                                                     |
| --------------- | ---------- | ------- | ------------------------------------------------------------------------------- |
| `suffix`        | `string`   | `"..."` | Appended after truncated content                                                |
| `wordBoundary`  | `boolean`  | `true`  | Prefer breaking at whitespace; with `locale`, uses word segments when supported |
| `stripHtml`     | `boolean`  | `false` | Strip tags before measuring/truncating                                          |
| `emojiSafe`     | `boolean`  | `true`  | Grapheme-aware counting and slicing                                             |
| `locale`        | `string`   | —       | BCP-47 tag (e.g. `"th"`, `"ja"`) for `Intl.Segmenter`                           |
| `preserveWords` | `string[]` | —       | Substrings that must not be cut in the middle                                   |

### Word boundaries

Without `locale`, after fitting the content budget the result backs up to the last Unicode whitespace **only if** the cut would otherwise separate two word characters (letters or numbers). Newlines and tabs count as whitespace.

With `locale` and `wordBoundary`, word breaks use `Intl.Segmenter` with `granularity: "word"` when available; otherwise behavior falls back to grapheme slicing plus the whitespace rule above.

### Runtime

`Intl.Segmenter` is used when present (Node 18+). Older runtimes fall back to code-point iteration from the string iterator.

## Scripts

```bash
pnpm build        # tsup → dist (ESM + CJS + .d.ts)
pnpm test         # vitest run
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint src
```

## License

MIT
