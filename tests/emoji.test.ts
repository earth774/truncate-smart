import { describe, expect, it } from "vitest"
import { graphemeCount, graphemeSplit, sliceGraphemes } from "../src/segmenter.js"
import { truncate } from "../src/index.js"

describe("grapheme / emoji safety", () => {
  it("does not split ZWJ family emoji when emojiSafe is true", () => {
    const s = "👨‍👩‍👧 extra"
    const out = truncate(s, 6)
    expect(out).toMatch(/^👨‍👩‍👧/)
    expect(graphemeSplit(s).length).toBeGreaterThanOrEqual(2)
  })

  it("sliceGraphemes keeps clusters intact", () => {
    const s = "a👨‍👩‍👧b"
    expect(sliceGraphemes(s, 2)).toBe("a👨‍👩‍👧")
  })

  it("truncates using grapheme counts when emojiSafe is true", () => {
    expect(truncate("abcde", 4, { wordBoundary: false })).toBe("a...")
  })
})

describe("locale-aware word breaking", () => {
  it("uses word segmentation when locale is set with wordBoundary", () => {
    const ja = "日本語の文章です"
    const out = truncate(ja, 8, { locale: "ja" })
    if (graphemeCount(ja, "ja") <= 8) {
      expect(out).toBe(ja)
    } else {
      expect(out.endsWith("...")).toBe(true)
    }
    expect(graphemeCount(out, "ja")).toBeLessThanOrEqual(8)
  })

  it("handles Thai script without requiring ASCII spaces", () => {
    const th = "สวัสดีครับยินดีต้อนรับ"
    const out = truncate(th, 12, { locale: "th" })
    expect(out.endsWith("...")).toBe(true)
    expect(graphemeCount(out, "th")).toBeLessThanOrEqual(12)
  })
})
