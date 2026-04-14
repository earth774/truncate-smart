import { describe, expect, it } from "vitest"
import { stripHtml, truncate } from "../src/index.js"

describe("stripHtml", () => {
  it("removes angle-bracket tags", () => {
    expect(stripHtml('<a href="#">x</a>')).toBe("x")
    expect(stripHtml("<div>hello</div>")).toBe("hello")
  })
})

describe("truncate with stripHtml", () => {
  it("strips HTML before measuring and truncating plain text", () => {
    const html = '<p class="x">Hello <strong>world</strong> today</p>'
    expect(truncate(html, 14, { stripHtml: true })).toBe("Hello world...")
  })

  it("returns empty string when HTML reduces to whitespace only", () => {
    expect(truncate("<p>   \n</p>", 20, { stripHtml: true })).toBe("")
  })
})
