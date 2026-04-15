import type { TruncateOptions } from "./types.js"
import {
  graphemeCount,
  graphemeSplit,
  lastWhitespaceIndex,
  sliceByWordSegments,
  sliceGraphemes,
} from "./segmenter.js"
import { stripHtml as stripHtmlTags } from "./stripHtml.js"

function normalizeInput(str: string | null | undefined): string {
  if (str == null) {
    return ""
  }
  return str
}

function isWhitespaceOnly(str: string): boolean {
  return str.length > 0 && /^\s+$/u.test(str)
}

function normalizeMaxLength(maxLength: number): number {
  if (!Number.isFinite(maxLength)) {
    return 0
  }
  return Math.max(0, Math.floor(maxLength))
}

function applyPreserveWords(full: string, prefix: string, words: string[]): string {
  let end = prefix.length
  for (const w of words) {
    if (w.length === 0) {
      continue
    }
    let from = 0
    while (from < full.length) {
      const p = full.indexOf(w, from)
      if (p === -1) {
        break
      }
      if (p < end && end < p + w.length) {
        end = Math.min(end, p)
      }
      from = p + 1
    }
  }
  return full.slice(0, end)
}

function isWordGrapheme(g: string): boolean {
  return /\p{L}|\p{N}/u.test(g)
}

/**
 * True when `sliced` is a strict prefix of `full` and the cut separates two word characters
 * (letters or numbers), i.e. we would split a word without a whitespace boundary.
 */
function cutsMidWord(sliced: string, full: string, locale?: string): boolean {
  if (sliced.length === 0 || sliced.length >= full.length) {
    return false
  }
  const lastG = graphemeSplit(sliced, locale).at(-1) ?? ""
  const rest = full.slice(sliced.length)
  const firstG = graphemeSplit(rest, locale).at(0) ?? ""
  if (/\s/u.test(lastG) || /\s/u.test(firstG)) {
    return false
  }
  return isWordGrapheme(lastG) && isWordGrapheme(firstG)
}

function applyWhitespaceWordBoundary(sliced: string, full: string, locale?: string): string {
  if (!cutsMidWord(sliced, full, locale)) {
    return sliced
  }
  const idx = lastWhitespaceIndex(sliced)
  if (idx > 0) {
    return sliced.slice(0, idx)
  }
  return sliced
}

/**
 * Truncates a string with optional HTML stripping, grapheme-safe slicing, locale-aware word
 * breaking, and preserved substrings.
 */
export function truncate(
  str: string | null | undefined,
  maxLength: number,
  options?: TruncateOptions,
): string {
  const suffix = options?.suffix ?? "..."
  const wordBoundary = options?.wordBoundary ?? true
  const shouldStripHtml = options?.stripHtml ?? false
  const emojiSafe = options?.emojiSafe ?? true
  const locale = options?.locale
  const preserveWords = options?.preserveWords

  let working = normalizeInput(str)
  if (shouldStripHtml) {
    working = stripHtmlTags(working)
  }

  if (isWhitespaceOnly(working)) {
    return ""
  }

  const max = normalizeMaxLength(maxLength)
  const suffixLengthUnits = emojiSafe ? graphemeCount(suffix, locale) : suffix.length

  const effectiveLength = emojiSafe ? graphemeCount(working, locale) : working.length
  if (effectiveLength <= max) {
    return working
  }

  if (max <= suffixLengthUnits) {
    return suffix
  }

  const contentMax = max - suffixLengthUnits

  let sliced: string
  if (wordBoundary && locale) {
    sliced = sliceByWordSegments(working, contentMax, locale)
  } else if (emojiSafe) {
    sliced = sliceGraphemes(working, contentMax, locale)
  } else {
    sliced = working.slice(0, contentMax)
  }

  if (wordBoundary && !locale) {
    sliced = applyWhitespaceWordBoundary(sliced, working, locale)
  }

  if (preserveWords && preserveWords.length > 0) {
    sliced = applyPreserveWords(working, sliced, preserveWords)
  }

  return sliced + suffix
}
