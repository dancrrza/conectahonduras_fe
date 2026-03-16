import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "use-intl";
import { getDictionaries } from "@/sanity/queries/dictionaries";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const messages = await getDictionaries(locale);

  return {
    locale,
    messages,
    onError() {
      // Completely suppress - no logging, no throwing
    },

    getMessageFallback({ key }) {
      return key;
    },
  };
});
