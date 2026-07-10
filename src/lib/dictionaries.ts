import type { Locale } from "@/lib/i18n-config";
import type en from "@/dictionaries/en.json";

export type Dictionary = typeof en;

// Server-only content map: each entry is a dynamic import so only the
// dictionary for the requested locale is loaded/bundled per request.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/dictionaries/en.json").then((mod) => mod.default),
  es: () => import("@/dictionaries/es.json").then((mod) => mod.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
