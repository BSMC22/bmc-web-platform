# Activity Log vs. Audit Log

Estas dos entidades se confunden fácilmente porque ambas son "un registro de que algo pasó" — pero cumplen funciones distintas, tienen audiencias distintas y requisitos de inmutabilidad distintos. Nunca deben fusionarse en una sola tabla.

---

## Diferencia central

| | ActivityLog | AuditLog |
|---|---|---|
| **Propósito** | Contarle al usuario "qué pasó" en un lenguaje de negocio, dentro del contexto de una entidad que está viendo | Registro técnico e inmutable para investigación, cumplimiento y seguridad |
| **Audiencia** | Cualquier rol con acceso a la entidad relacionada (un inspector ve el activity log de sus propios Jobs) | Exclusivamente `super_admin` |
| **Contenido típico** | "Inspector asignado", "Reporte subido", "Cotización aceptada", "Factura enviada" | "Usuario X cambió el rol de Usuario Y de `operations` a `finance`", "Factura INV-BMC-2026-0231 anulada por Usuario Z", "Documento sensible descargado" |
| **Qué eventos genera** | Eventos de negocio relevantes para el flujo de trabajo | Acciones críticas: cambios de permisos, cambios de monto en documentos financieros ya emitidos, anulaciones, acceso a datos sensibles, cambios de datos bancarios |
| **Granularidad** | Uno por evento de negocio significativo | Uno por cada acción crítica individual, incluyendo el valor anterior y nuevo |
| **Mutabilidad** | Append-only (no se edita), pero conceptualmente es "informativo" | Append-only e **inmutable por diseño** — ni siquiera `super_admin` puede editar o eliminar una fila vía la aplicación |
| **Retención** | Puede tener política de retención más corta (es UX, no cumplimiento) | Debe conservarse el máximo tiempo posible — es el registro de cumplimiento/seguridad |

---

## Ejemplo concreto sobre el mismo hecho

Cuando finance anula una Invoice ya emitida:

- **ActivityLog** registra: *"Invoice INV-BMC-2026-0231 fue anulada"* — visible para operations/commercial/finance que siguen ese Job, en un lenguaje simple.
- **AuditLog** registra: *entityType: "Invoice", entityId: "...", action: "voided", actorId: "...", occurredAt: "...", previousValue: { status: "sent", totalAmount: {...} }, newValue: { status: "voided" }* — visible solo para `super_admin`, con el detalle técnico completo necesario para una auditoría externa.

No todo evento de `ActivityLog` genera un `AuditLog` (asignar un inspector no es una acción "crítica" en el sentido de seguridad/cumplimiento) — pero todo evento de `AuditLog` **debería** también tener su equivalente legible en `ActivityLog`, salvo que sea deliberadamente solo-técnico (ej. un intento de acceso denegado).

---

## Esquemas de metadata

```ts
type ActivityLogEntry = {
  id: ActivityLogId;
  relatedType: string;       // "job" | "invoice" | "quotation" | ...
  relatedId: string;
  action: string;             // "inspector_assigned" | "report_uploaded" | "quotation_accepted" | ...
  actorId: UserId;
  occurredAt: IsoTimestamp;
  summary?: string;           // texto legible, ej. "Juan Pérez fue asignado como inspector líder"
  metadata?: Record<string, string | number | boolean>; // acotado, sin objetos anidados libres
};

type AuditLogEntry = {
  id: AuditLogId;
  entityType: string;
  entityId: string;
  action: string;             // "role_changed" | "invoice_voided" | "sensitive_document_accessed" | ...
  actorId: UserId;
  occurredAt: IsoTimestamp;
  previousValue?: Record<string, unknown>; // snapshot acotado del estado anterior relevante
  newValue?: Record<string, unknown>;      // snapshot acotado del estado nuevo relevante
};
```

Nota: `metadata`/`previousValue`/`newValue` se documentan como objetos "acotados" (no arbitrarios) — en Fase 3 se recomienda definir un tipo específico por `action` en vez de `Record<string, unknown>` genérico, para no perder tipado; se deja como `unknown` aquí solo porque el dominio de esta fase no fija todavía la lista cerrada de acciones.

---

## Qué dispara cada uno (ver también business-rules.md)

**Siempre genera AuditLog**: cambios de `UserRole`/`CompanyMembership` (otorgar/revocar acceso), anulación de `Invoice`/`Quotation`, corrección de montos ya emitidos, acceso o descarga de `Document` con `sensitivityLevel = sensitive`, cambios a datos bancarios de un Inspector o de la Company.

**Genera ActivityLog** (lista no exhaustiva, ampliable sin romper el modelo): cambios de estado de Lead/Opportunity/Quotation/Job en cualquiera de sus dimensiones, asignación/confirmación/declinación de `JobAssignment`, envío/aprobación/rechazo de `InspectionReport`, envío de `Invoice`, registro de `Payment`, comentarios (`Comment`) relevantes.
