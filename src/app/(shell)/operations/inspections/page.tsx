import type { Metadata } from "next";
import InspectionCreateForm, { STATUS_LABELS } from "@/components/operations/inspection-create-form";
import InspectionAssignPanel from "@/components/operations/inspection-assign-panel";
import { createClient } from "@/lib/supabase/server";
import type {
  AdminUser,
  Inspection,
  InspectionAssignment,
  InspectionStatus,
} from "@/lib/supabase/types";

const statusStyles: Record<InspectionStatus, string> = {
  scheduled: "bg-blue-50 text-blue-700",
  in_progress: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export const metadata: Metadata = {
  title: "Inspecciones — Operations — Blueseas OS",
  description: "Creá inspecciones y asigná inspectores.",
};

export default async function OperationsInspectionsPage() {
  const supabase = await createClient();

  const [{ data: inspections }, { data: assignments }, { data: usersData }] = await Promise.all([
    supabase.from("inspections").select("*").order("created_at", { ascending: false }).returns<Inspection[]>(),
    supabase.from("inspection_assignments").select("*").returns<InspectionAssignment[]>(),
    supabase.rpc("admin_list_users"),
  ]);

  const users = (usersData ?? []) as unknown as AdminUser[];
  const inspectors = users.filter((u) => u.role === "inspector");
  const inspectorLabel = (u: AdminUser) => u.full_name || u.email;
  const inspectorById = new Map(inspectors.map((u) => [u.id, inspectorLabel(u)]));

  const assignedByInspection = new Map<string, string[]>();
  (assignments ?? []).forEach((a) => {
    const list = assignedByInspection.get(a.inspection_id) ?? [];
    list.push(a.inspector_id);
    assignedByInspection.set(a.inspection_id, list);
  });

  const dateFormatter = new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-900">Inspecciones</h1>
        <p className="mt-1 text-sm text-brand-slate-600">
          Creá inspecciones y asignales inspectores.
        </p>
      </div>

      <div className="rounded-xl border border-brand-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy-900">
          Nueva inspección
        </h2>
        <div className="mt-4">
          <InspectionCreateForm />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy-900">
          Todas las inspecciones
        </h2>

        <div className="mt-4 space-y-3">
          {!inspections || inspections.length === 0 ? (
            <p className="rounded-lg border border-dashed border-brand-slate-300 bg-white px-6 py-10 text-center text-sm text-brand-slate-500">
              Todavía no hay inspecciones. Creá la primera arriba.
            </p>
          ) : (
            inspections.map((inspection) => {
              const assignedIds = assignedByInspection.get(inspection.id) ?? [];
              const assigned = assignedIds
                .filter((id) => inspectorById.has(id))
                .map((id) => ({ id, label: inspectorById.get(id)! }));
              const available = inspectors
                .filter((u) => !assignedIds.includes(u.id))
                .map((u) => ({ id: u.id, label: inspectorLabel(u) }));

              return (
                <div
                  key={inspection.id}
                  className="rounded-lg border border-brand-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-brand-navy-900">{inspection.title}</h3>
                      <p className="mt-1 text-sm text-brand-slate-600">
                        Cliente: {inspection.client_name}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[inspection.status]}`}
                    >
                      {STATUS_LABELS[inspection.status]}
                    </span>
                  </div>

                  {inspection.scheduled_date && (
                    <p className="mt-2 text-xs text-brand-slate-500">
                      Fecha programada: {dateFormatter.format(new Date(inspection.scheduled_date))}
                    </p>
                  )}

                  <div className="mt-4 border-t border-brand-slate-100 pt-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-slate-500">
                      Inspectores asignados
                    </p>
                    <InspectionAssignPanel
                      inspectionId={inspection.id}
                      assigned={assigned}
                      available={available}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
