import { getLocale, getTranslations } from "next-intl/server";

export async function translate(key: string, params?: Record<string, string>) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  try {
    return t(key, params);
  } catch {
    return key; // return key if missing
  }
}
