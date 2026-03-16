export type Locale = "en" | "es";

export type Dictionaries = {
  entries?: { keyword: string; en?: string; es?: string }[];
} | null;

// ─── Runtime store ─────────────────────────────────────────────────────────────

let _dict: Record<string, Record<Locale, string>> = {};
let _locale: Locale = "en";

/**
 * Call once in your root layout after fetching the dictionaries document.
 *
 * @example
 * const doc = await sanityClient.fetch(`*[_type == "dictionaries"][0]`);
 * initTranslations(doc, "en");
 */
export function initTranslations(doc: Dictionaries, locale: Locale = "en") {
  _locale = locale;
  if (!doc?.entries) return;
  _dict = {};
  for (const entry of doc.entries) {
    if (!entry.keyword) continue;
    _dict[entry.keyword] = {
      en: entry.en ?? "",
      es: entry.es ?? "",
    };
  }
}

export function setLocale(locale: Locale) {
  _locale = locale;
}

/**
 * Returns the translated string for a key in the current locale.
 * Falls back: current locale → "en" → key itself.
 */
export function translate(key: string): string {
  const entry = _dict[key];

  console.log({ _dict, keys: _dict[key], key });
  if (!entry) return key;
  return entry[_locale] || entry["en"] || key;
}
