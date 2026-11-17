/**
 * Client data that is still a placeholder (`+998 (XX)…`, `№ XXXX`, bare social roots) is never
 * shown to visitors where it would look unfinished, and never reaches search engines.
 */
export function isPlaceholder(value: string): boolean {
  if (/X{2,}/.test(value) || value.includes('example.com')) return true;
  if (/^https?:\/\//.test(value)) {
    try {
      return new URL(value).pathname.replace(/\/+$/, '') === '';
    } catch {
      return true;
    }
  }
  return false;
}
