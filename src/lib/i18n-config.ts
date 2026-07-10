export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

// English is the default locale for visitors without a language preference in
// their browser (Accept-Language header) or an existing locale in the URL.
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
