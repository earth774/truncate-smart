import type { TruncateOptions } from "./types.js"
import { truncate } from "./truncate.js"

/**
 * Returns a function that truncates with fixed default options.
 */
export function createTruncator(
  defaults: TruncateOptions,
): (str: string, maxLength: number) => string {
  return (str: string, maxLength: number) => truncate(str, maxLength, defaults)
}
