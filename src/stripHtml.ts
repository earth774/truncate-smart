/**
 * Removes HTML tags using a lightweight regex. Does not parse HTML.
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "")
}
