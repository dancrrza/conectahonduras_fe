"use client";

import { createContext, useContext } from "react";

const FallbackImageContext = createContext<string>("");

export const useFallbackImage = () => useContext(FallbackImageContext);

export function FallbackImageProvider({
  children,
  fallbackSrc,
}: {
  children: React.ReactNode;
  fallbackSrc: string;
}) {
  return (
    <FallbackImageContext.Provider value={fallbackSrc}>
      {children}
    </FallbackImageContext.Provider>
  );
}
