import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

// RTL languages list
const RTL_LOCALES = ["ar", "he", "fa", "ur"];

export const isRtlDirection = (locale?: string): boolean | Promise<boolean> => {
  // Client-side: return boolean directly
  if (typeof window !== "undefined") {
    return document.documentElement.dir === "rtl";
  }

  // Server-side: return promise
  return (async () => {
    if (typeof window !== "undefined") {
      return document.documentElement.dir === "rtl";
    }

    const currentLocale = locale ?? (await getLocale());
    return RTL_LOCALES.includes(currentLocale);
  })();
};

export const getLocaleClientSide = () => {
  let locale;
  if (typeof window !== "undefined") {
    locale = window.currentLocale;
  }
  return locale ?? routing.defaultLocale;
};
