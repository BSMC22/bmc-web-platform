import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

/**
 * Shared guard for the new flat "Blueseas OS" module shells (Executive,
 * Operations, Finance, Shareholder, Client). Only the "admin" role is real
 * in Supabase today, so every one of those modules is gated behind it for
 * now - see src/lib/roles.ts for the full (mostly future) role model.
 *
 * Redirects to /login if there's no session or the user isn't an admin.
 * Returns the authenticated user + profile otherwise, so callers can render
 * a display name without a second query.
 */
export async function requireAdminOrRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle<Pick<Profile, "role" | "full_name">>();

  if (profile?.role !== "admin") {
    redirect("/login");
  }

  return { user, profile };
}
