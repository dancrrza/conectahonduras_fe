import { defineRouting } from "next-intl/routing";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "localhost";
const isDev = process.env.NODE_ENV === "development";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  domains: [
    {
      domain: isDev ? `en.${DOMAIN}:3000` : DOMAIN,
      defaultLocale: "en",
      locales: ["en"],
    },
    {
      domain: isDev ? `${DOMAIN}:3000` : DOMAIN,
      defaultLocale: "es",
      locales: ["es"],
    },
  ],
  localePrefix: { mode: "never" },
});
