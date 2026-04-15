import { afterEach, beforeEach, describe, expect, it } from "vitest"
import {
  graphemeCount,
  graphemeSplit,
  lastWhitespaceIndex,
  sliceByWordSegments,
  sliceGraphemes,
} from "../src/segmenter.js"

describe("segmenter", () => {
  it("sliceGraphemes returns empty string when maxGraphemes is zero or negative", () => {
    expect(sliceGraphemes("hello", 0)).toBe("")
    expect(sliceGraphemes("hello", -1)).toBe("")
  })

  it("sliceGraphemes returns the original string when it fits within maxGraphemes", () => {
    expect(sliceGraphemes("hi", 5)).toBe("hi")
    expect(sliceGraphemes("", 3)).toBe("")
  })

  it("lastWhitespaceIndex finds the last Unicode whitespace", () => {
    expect(lastWhitespaceIndex("a b")).toBe(1)
    expect(lastWhitespaceIndex("a\tb\nc")).toBe(3)
    expect(lastWhitespaceIndex("none")).toBe(-1)
  })

  describe("without Intl.Segmenter", () => {
    let segmenterDescriptor: PropertyDescriptor | undefined

    beforeEach(() => {
      segmenterDescriptor = Object.getOwnPropertyDescriptor(Intl, "Segmenter")
      Reflect.deleteProperty(Intl, "Segmenter")
    })

    afterEach(() => {
      if (segmenterDescriptor !== undefined) {
        Object.defineProperty(Intl, "Segmenter", segmenterDescriptor)
      }
    })

    it("graphemeSplit falls back to string iteration", () => {
      expect(graphemeSplit("ab")).toEqual(["a", "b"])
    })

    it("graphemeCount uses fallback splitting", () => {
      expect(graphemeCount("xy")).toBe(2)
    })

    it("sliceByWordSegments falls back to sliceGraphemes", () => {
      expect(sliceByWordSegments("hello there", 5, "en")).toBe("hello")
    })
  })
})
