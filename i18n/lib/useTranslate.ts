"use client";

import { useTranslations } from "next-intl";

export type Translate = (key: string) => string;

export function useTranslate() {
  const t = useTranslations("common");

  return (key: string, params?: Record<string, string>) => {
    try {
      return t(key, params);
    } catch {
      return key; // return key if missing
    }
  };
}
