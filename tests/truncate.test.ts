import { describe, expect, it } from "vitest"
import { createTruncator, truncate, truncateAll } from "../src/index.js"

describe("truncate", () => {
  it("returns the string unchanged when length is within maxLength (no suffix)", () => {
    expect(truncate("hello", 10)).toBe("hello")
    expect(truncate("hello", 5)).toBe("hello")
  })

  it("truncates with default suffix", () => {
    expect(truncate("hello world", 8)).toBe("hello...")
  })

  it("respects custom suffix", () => {
    expect(truncate("hello world", 9, { suffix: "…" })).toBe("hello…")
  })

  it("createTruncator applies defaults", () => {
    const t = createTruncator({ suffix: "++", wordBoundary: false })
    expect(t("abcdefgh", 6)).toBe("abcd++")
  })

  it("truncateAll maps each entry", () => {
    expect(truncateAll(["abc", "defghij"], 5)).toEqual(["abc", "de..."])
  })
})
