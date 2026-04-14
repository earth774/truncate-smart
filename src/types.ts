/**
 * Options for {@link truncate}.
 */
export interface TruncateOptions {
  /** Appended after truncated content. Default: `"..."` */
  suffix?: string
  /**
   * When true, prefer breaking at whitespace (or word segments when `locale` is set).
   * Default: `true`
   */
  wordBoundary?: boolean
  /** Strip HTML tags before measuring and truncating. Default: `false` */
  stripHtml?: boolean
  /**
   * When true, measure and slice using grapheme clusters (via `Intl.Segmenter` when available).
   * Default: `true`
   */
  emojiSafe?: boolean
  /**
   * BCP 47 locale (e.g. `"th"`, `"ja"`). When set with `wordBoundary`, word breaking uses
   * `Intl.Segmenter` with `granularity: "word"` when supported.
   */
  locale?: string
  /** Substrings that must not be cut mid-string */
  preserveWords?: string[]
}
