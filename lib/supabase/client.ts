import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        // Bypass Web Locks API to prevent upload timeouts in multi-tab scenarios
        lock: async (_name, _acquireTimeout, fn) => fn(),
      },
    },
  );
}
