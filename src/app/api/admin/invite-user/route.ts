import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileRole } from "@/lib/supabase/types";

/**
 * Invites a new user by email (admin-only).
 *
 * Requires `SUPABASE_SERVICE_ROLE_KEY` to be set server-side — this key
 * bypasses RLS entirely, so it must never be exposed to the browser. We only
 * use it here, after independently verifying the caller is an authenticated
 * admin via the regular cookie-based session.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : null;
  const role: ProfileRole = body?.role === "admin" ? "admin" : "inspector";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<Pick<Profile, "role">>();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "Server is missing SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const adminClient = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email);

  if (inviteError || !invited?.user) {
    return NextResponse.json(
      { error: inviteError?.message ?? "Could not send the invite." },
      { status: 400 }
    );
  }

  // `handle_new_user()` already created a default profile row (role
  // "inspector", full_name null) via the auth trigger. Update it to match
  // the role/name chosen in the invite form.
  const { error: profileUpdateError } = await adminClient
    .from("profiles")
    .update({ role, full_name: fullName })
    .eq("id", invited.user.id);

  if (profileUpdateError) {
    return NextResponse.json({ error: profileUpdateError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
