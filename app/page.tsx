"use client";

import { Hero } from "@/components/widgets/Hero";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#143952] to-[#0f2740]">
      <main className="min-h-screen w-full max-w-7xl py-15">
        <Hero />
      </main>
    </div>
  );
}
