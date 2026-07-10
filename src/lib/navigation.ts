import type { Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/dictionaries";

export type NavKey = keyof Dictionary["common"]["nav"];

export type NavLink = {
  key: NavKey;
  label: string;
  href: string;
};

const navKeys: NavKey[] = [
  "home",
  "about",
  "services",
  "industries",
  "coverage",
  "contact",
];

const navPaths: Record<NavKey, string> = {
  home: "",
  about: "/about",
  services: "/services",
  industries: "/industries",
  coverage: "/coverage",
  contact: "/contact",
};

export function localizedPath(lang: Locale, path: string = ""): string {
  return `/${lang}${path}`;
}

export function getPrimaryNav(lang: Locale, dict: Dictionary): NavLink[] {
  return navKeys.map((key) => ({
    key,
    label: dict.common.nav[key],
    href: localizedPath(lang, navPaths[key]),
  }));
}
