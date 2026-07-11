"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOutIcon } from "@/components/icons";

/**
 * Shared by both the bilingual Inspector Portal and the new flat
 * "Blueseas OS" module shells - each caller passes the right post-logout
 * destination (e.g. `/en/portal/login` vs `/login`) rather than this
 * component guessing at locale.
 */
export default function LogoutButton({
  redirectTo,
  label,
}: {
  redirectTo: string;
  label: string;
}) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-brand-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-60"
    >
      <LogOutIcon className="h-4 w-4" />
      {label}
    </button>
  );
}
