# Roles and permissions (conceptual)

Matriz conceptual — no implementa autorización real, documenta la intención para Fase 3. Un usuario puede tener **más de un rol simultáneamente** (vía `UserRole`, ver [entity-catalog.md](./entity-catalog.md)); los permisos efectivos son la unión de los permisos de todos sus roles activos.

Roles: `super_admin`, `admin`, `operations`, `commercial`, `finance`, `shareholder`, `inspector`, `client`.

Convención: `V` = ver, `C` = crear, `M` = modificar, `A` = eliminar/archivar, `—` = sin acceso. Todas las celdas son de alcance **dentro de la(s) Company del usuario** vía `CompanyMembership` (regla #26 de [business-rules.md](./business-rules.md)), salvo `super_admin` que ve entre compañías.

## Commercial

| Entidad | super_admin | admin | operations | commercial | finance | shareholder | inspector | client |
|---|---|---|---|---|---|---|---|---|
| Lead | VCMA | VCMA | V | VCMA | V | V (agregado) | — | — |
| Opportunity | VCMA | VCMA | V | VCMA | V | V (agregado) | — | — |
| Quotation | VCMA | VCMA | V | VCMA | V | V (agregado) | — | V (propias, fase futura) |

## Business Data

| Entidad | super_admin | admin | operations | commercial | finance | shareholder | inspector | client |
|---|---|---|---|---|---|---|---|---|
| Client | VCMA | VCMA | V | VCM | V | V (agregado) | — | V (propio) |
| ClientContact | VCMA | VCMA | V | VCM | V | — | — | — |
| Vessel | VCMA | VCMA | VCM | V | V | — | V (asociadas) | V (propias) |
| Inspector | VCMA | VCMA | VCM | V | V | — | V (propia ficha) | — |
| InspectorQualification | VCMA | VCMA | VCM | — | V | — | VC (propia) | — |
| Country / Port / ServiceType / Currency | VCMA | VCMA | VC | VC | V | V | V | V |

## Operations

| Entidad | super_admin | admin | operations | commercial | finance | shareholder | inspector | client |
|---|---|---|---|---|---|---|---|---|
| Job | VCMA | VCMA | VCM | V | V (facturación) | V (agregado) | V (propios) | V (propios, fase futura) |
| JobAssignment | VCMA | VCMA | VCM | — | — | — | VM (propia: confirmar/declinar) | — |
| Inspection | VCMA | VCMA | VCM | — | V | — | VM (propias, ejecución) | — |
| InspectionReport | VCMA | VCMA | VM (revisión) | — | V | — | VC (propios) | V (aprobados, fase futura) |
| JobMilestone / JobStatusHistory | VCMA | VCMA | VC | — | V (billing) | V (agregado) | — | — |
| OperationalNote | VCMA | VCMA | VCM | VC | — | — | — | V (si `client_visible`) |

## Finance

| Entidad | super_admin | admin | operations | commercial | finance | shareholder | inspector | client |
|---|---|---|---|---|---|---|---|---|
| Invoice | VCMA | VCMA | V | V | VCMA | V (agregado) | — | V (propias, fase futura) |
| Expense | VCMA | VCMA | VC (propio Job) | — | VM (aprobación) | V (agregado) | VC (propias) | — |
| Payment | VCMA | VCMA | — | V | VCM | V (agregado) | — | V (propios, fase futura) |
| CollectionActivity | VCMA | VCMA | — | — | VC | — | — | — |

## Documents

| Entidad | super_admin | admin | operations | commercial | finance | shareholder | inspector | client |
|---|---|---|---|---|---|---|---|---|
| Document | VCMA | VCMA | VC (según categoría) | VC (según categoría) | VC (según categoría) | V (según `visibility`) | VC (según categoría, ej. reportes/calificaciones) | V (según `visibility`) |

## Administration / Governance

| Entidad | super_admin | admin | operations | commercial | finance | shareholder | inspector | client |
|---|---|---|---|---|---|---|---|---|
| User / CompanyMembership / UserRole | VCMA | VCMA (su Company) | — | — | — | — | — | — |
| Role / Permission (catálogo) | VCMA | V | — | — | — | — | — | — |
| ActivityLog | VCMA | VCMA | V (sus Jobs) | V (sus Leads/Opportunities) | V (sus Invoices) | — | V (sus Jobs) | — |
| AuditLog | VCMA (solo lectura real; nadie modifica/elimina) | — | — | — | — | — | — | — |

### Notas

- `AuditLog` nunca es `M`/`A` para nadie, incluido `super_admin` — es append-only por diseño (regla #35 de business-rules.md).
- `shareholder` tiene visibilidad agregada/read-only en prácticamente todo — nunca `C`/`M`/`A` en ningún contexto operativo o comercial, consistente con ser un rol de solo-reporte financiero.
- `inspector` y `client` solo ven su propio subconjunto (asignaciones propias / registros del cliente propio) — nunca el catálogo completo, incluso dentro de la misma Company.
- Esta matriz es conceptual: no hay motor de permisos ni tabla `RolePermission` implementada en esta fase — ver [entity-catalog.md](./entity-catalog.md) (`Permission`) y [open-decisions.md](./open-decisions.md).
