import type { TruncateOptions } from "./types.js"
import { truncate } from "./truncate.js"

/**
 * Truncates each string in `strs` using the same options.
 */
export function truncateAll(
  strs: string[],
  maxLength: number,
  options?: TruncateOptions,
): string[] {
  return strs.map((s) => truncate(s, maxLength, options))
}
