import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { hasLocale } from "use-intl";
import es from "@/messages/es.json";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: es,
    onError() {},
    getMessageFallback({ key }) {
      return key;
    },
  };
});
