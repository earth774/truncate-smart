import { describe, expect, it } from "vitest"
import { truncate } from "../src/index.js"

describe("edge cases", () => {
  it("returns suffix as-is when maxLength is less than or equal to suffix length", () => {
    expect(truncate("hello world", 2, { suffix: "..." })).toBe("...")
    expect(truncate("hello world", 3, { suffix: "..." })).toBe("...")
  })

  it("returns empty string for null or undefined input", () => {
    expect(truncate(null, 10)).toBe("")
    expect(truncate(undefined, 10)).toBe("")
  })

  it("returns empty string for whitespace-only input", () => {
    expect(truncate("   ", 10)).toBe("")
    expect(truncate("\n\t  \r", 5)).toBe("")
  })

  it("falls back to hard cut when wordBoundary is true but no whitespace exists", () => {
    expect(truncate("abcdefghij", 6)).toBe("abc...")
  })

  it("treats newlines and tabs as whitespace for word boundaries", () => {
    expect(truncate("hello\nworld", 10)).toBe("hello...")
    expect(truncate("hello\tworld", 10)).toBe("hello...")
  })

  it("when only room for suffix remains, returns suffix-sized output", () => {
    expect(truncate("nospaceshere", 3, { suffix: "..." })).toBe("...")
  })

  it("does not append suffix when input already fits maxLength", () => {
    expect(truncate("hi", 5)).toBe("hi")
  })

  it("preserveWords avoids cutting inside a protected substring", () => {
    const text = "foo keepme bar"
    expect(
      truncate(text, 12, {
        wordBoundary: false,
        emojiSafe: false,
        preserveWords: ["keepme"],
      }),
    ).toBe("foo ...")
  })

  it("emojiSafe false uses UTF-16 length and may split unpaired surrogates in pathological input", () => {
    const s = "a\uD800"
    const r = truncate(s, 2, { emojiSafe: false, wordBoundary: false, suffix: "" })
    expect(r).toBe("a\uD800".slice(0, 2))
  })

  it("treats non-finite maxLength as zero and returns the suffix when content would exceed it", () => {
    expect(truncate("hello", Number.NaN)).toBe("...")
    expect(truncate("hello", Number.POSITIVE_INFINITY)).toBe("...")
  })

  it("ignores empty strings in preserveWords", () => {
    expect(
      truncate("hello world", 8, {
        wordBoundary: false,
        emojiSafe: false,
        preserveWords: ["", "world"],
      }),
    ).toBe("hello...")
  })
})
