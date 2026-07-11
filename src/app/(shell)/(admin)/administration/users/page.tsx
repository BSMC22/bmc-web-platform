import type { Metadata } from "next";
import InviteUserForm from "@/components/administration/invite-user-form";
import UserRoleForm from "@/components/administration/user-role-form";
import { createClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Usuarios — Administration — Blueseas OS",
  description: "Gestioná inspectores y administradores.",
};

export default async function ExecutiveUsersPage() {
  const supabase = await createClient();
  const { data: usersData } = await supabase.rpc("admin_list_users");
  const users = ((usersData ?? []) as unknown as AdminUser[]).slice().sort((a, b) =>
    a.created_at < b.created_at ? 1 : -1
  );

  const dateFormatter = new Intl.DateTimeFormat("es-AR", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-900">Usuarios</h1>
        <p className="mt-1 text-sm text-brand-slate-600">Consultá las cuentas y gestioná los roles.</p>
      </div>

      <div className="rounded-xl border border-brand-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy-900">Invitar usuario</h2>
        <div className="mt-4">
          <InviteUserForm />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy-900">Todos los usuarios</h2>

        <div className="mt-4">
          {users.length === 0 ? (
            <p className="rounded-lg border border-dashed border-brand-slate-300 bg-white px-6 py-10 text-center text-sm text-brand-slate-500">
              Todavía no hay usuarios.
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-brand-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-brand-slate-200 bg-brand-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-brand-slate-500">Nombre</th>
                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-brand-slate-500">Email</th>
                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-brand-slate-500">Alta</th>
                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-brand-slate-500">Rol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-5 py-4 font-medium text-brand-navy-900">{u.full_name || "—"}</td>
                      <td className="px-5 py-4 text-brand-slate-600">{u.email}</td>
                      <td className="px-5 py-4 text-brand-slate-600">{dateFormatter.format(new Date(u.created_at))}</td>
                      <td className="px-5 py-4">
                        <UserRoleForm userId={u.id} currentRole={u.role} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
