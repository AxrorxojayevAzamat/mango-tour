/**
 * Fills `{key}` placeholders in a content template.
 * Unknown placeholders are left untouched so a typo is visible instead of silently empty.
 *
 * @example fill('© {year} mango_tour', { year: 2026 }) // '© 2026 mango_tour'
 */
export function fill(template: string, values: Readonly<Record<string, string | number>>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : match,
  );
}

/** Names of the `{placeholders}` used in a template. */
export function placeholdersOf(template: string): string[] {
  return [...template.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
}
