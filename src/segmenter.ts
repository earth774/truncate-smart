function hasIntlSegmenter(): boolean {
  return typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
}

/**
 * Splits `str` into grapheme clusters when `Intl.Segmenter` is available; otherwise uses
 * the string iterator (code points), which covers most emoji cases.
 */
export function graphemeSplit(str: string, locale?: string): string[] {
  if (hasIntlSegmenter()) {
    const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" })
    return [...segmenter.segment(str)].map((s) => s.segment)
  }
  return [...str]
}

export function graphemeCount(str: string, locale?: string): number {
  return graphemeSplit(str, locale).length
}

export function sliceGraphemes(str: string, maxGraphemes: number, locale?: string): string {
  if (maxGraphemes <= 0) {
    return ""
  }
  const graphemes = graphemeSplit(str, locale)
  if (graphemes.length <= maxGraphemes) {
    return str
  }
  return graphemes.slice(0, maxGraphemes).join("")
}

/**
 * Accumulates full `Intl.Segmenter` word segments until adding another segment would exceed
 * `maxGraphemes` grapheme count. Falls back to {@link sliceGraphemes} when word segmentation
 * is unavailable.
 */
export function sliceByWordSegments(str: string, maxGraphemes: number, locale: string): string {
  if (!hasIntlSegmenter()) {
    return sliceGraphemes(str, maxGraphemes, locale)
  }

  const wordSegmenter = new Intl.Segmenter(locale, { granularity: "word" })
  let used = 0
  let out = ""

  for (const { segment } of wordSegmenter.segment(str)) {
    const n = graphemeCount(segment, locale)
    if (used + n > maxGraphemes) {
      break
    }
    out += segment
    used += n
  }

  return out
}

/**
 * Index of the last whitespace code point start in `str`, or `-1` if none.
 * Uses Unicode `\s` via `String.prototype.match` iteration for whole code points.
 */
export function lastWhitespaceIndex(str: string): number {
  let last = -1
  const re = /\s/gu
  let m: RegExpExecArray | null
  while ((m = re.exec(str)) !== null) {
    last = m.index
  }
  return last
}
