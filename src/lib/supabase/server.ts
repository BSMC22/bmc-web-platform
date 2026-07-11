import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase client for use in Server Components, Route Handlers, and Server
 * Actions. Must be created fresh on every request — never share/cache this
 * across requests.
 *
 * Server Components can't write cookies (Next.js will throw if you try), so
 * `setAll` is wrapped in a try/catch there. As long as `src/proxy.ts` is
 * refreshing the session on every request, this is safe: any cookie writes
 * a Server Component would have made are instead handled by the proxy.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookies are refreshed by
            // src/proxy.ts instead, so this can be safely ignored.
          }
        },
      },
    }
  );
}
