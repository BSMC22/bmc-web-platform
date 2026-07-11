# Informe técnico — Fase 2: Domain Model & Core Business Architecture

Fecha: 10 de julio de 2026
Alcance: diseño formal del modelo de dominio de Blueseas OS, previo a diseñar tablas/migraciones reales de Supabase (Fase 3). Cero tablas nuevas, cero migraciones, cero cambios de schema, cero CRUD, cero formularios, cero pantallas nuevas, cero datos reales conectados, cero dependencias nuevas, cero cambios de autenticación/permisos reales.

**No se hizo commit ni push.** `HEAD` sigue en `18509af` (el mismo commit real desde Fase 1); todo lo acumulado desde Fase 1.5 en adelante —incluida esta Fase 2— permanece sin confirmar en git, tal como se pidió explícitamente.

---

## 1. Resumen ejecutivo

Se diseñó el modelo de dominio completo de Blueseas OS en dos capas independientes y desconectadas del código funcional existente:

- **`docs/domain/`** (14 archivos markdown): la documentación de negocio — bounded contexts, catálogo de 41 entidades con el template de 13 puntos exigido, cardinalidades y diagramas, ciclo de vida del Job en 3 dimensiones de estado, catálogo de 35 reglas de negocio, matriz de roles/permisos, estrategia de identificadores, modelo financiero y de monedas, estrategia de fechas/zonas horarias, modelo documental, diferencia Activity Log vs. Audit Log, y 14 decisiones abiertas con recomendación.
- **`src/domain/`** (58 archivos TypeScript): los tipos de dominio decoplados de Supabase que implementan esa documentación — IDs con branding, `Money`, fechas ISO tipadas, y una entidad de dominio (+ Create/Update Input donde aplica) por cada uno de los 41 conceptos del catálogo, organizados en 9 bounded contexts + `common/`.

El Job queda confirmado como la entidad central, con la relación 1:N hacia `Inspection` (una Inspection por visita física, no por Job) como la decisión estructural más importante de esta fase — ver sección 16 sobre el conflicto que esto genera con la tabla `inspections` actual.

`npx tsc --noEmit` y `npx eslint src` corren en 0 errores/0 warnings sobre todo el proyecto, incluyendo los 58 archivos nuevos. `npm run build` falla exactamente en el mismo punto que en todas las fases anteriores (descarga de Geist/Geist Mono desde Google Fonts, sin salida a internet en este sandbox) — no hay ningún error de código nuevo.

---

## 2. Árbol de archivos creados

```
docs/domain/
├── README.md
├── domain-overview.md
├── entity-catalog.md
├── relationships.md
├── lifecycle-and-statuses.md
├── business-rules.md
├── roles-and-permissions.md
├── identifiers.md
├── financial-model.md
├── dates-and-timezones.md
├── document-model.md
├── audit-and-activity.md
├── open-decisions.md
└── diagrams.md

src/domain/
├── index.ts                          ← barrel export (no importado por nada existente)
├── common/
│   ├── identifiers.ts                ← 38 branded ID types
│   ├── money.ts                      ← Money, ConvertedMoney, CurrencyCode
│   ├── dates.ts                      ← IsoTimestamp, IsoDate, IanaTimezone
│   ├── pagination.ts                 ← Page<T>, PageRequest
│   ├── audit.ts                      ← PolymorphicRef<T>
│   └── index.ts
├── identity/            (user, role, permission, user-role, company-membership + index)
├── organization/         (company, company-settings + index)
├── commercial/            (lead, opportunity, quotation, quotation-item, commercial-activity + index)
├── business-data/        (client, client-contact, vessel, inspector, inspector-qualification,
│                          inspector-availability, country, port, service-type, currency + index)
├── operations/           (job-status, job, job-assignment, inspection, inspection-report,
│                          job-milestone, job-status-history, operational-note + index)
├── finance/               (invoice, invoice-item, expense, payment, collection-activity + index)
├── documents/             (document, document-category, document-version + index)
├── communications/        (notification, comment + index)
└── governance/            (activity-log, audit-log + index)
```

58 archivos `.ts` en `src/domain/`, 14 archivos `.md` en `docs/domain/`. Ninguno importado por, ni conectado a, código funcional existente.

---

## 3. Catálogo de entidades

41 entidades documentadas en [docs/domain/entity-catalog.md](./docs/domain/entity-catalog.md) con el template completo de 13 puntos (propósito, qué representa/no representa, campos esenciales/opcionales, relaciones, estados, reglas de negocio, quién ve/crea/modifica/elimina, riesgos pendientes):

- **Identity & Access (5)**: User, Role, Permission, UserRole, CompanyMembership.
- **Organization (2)**: Company, CompanySettings.
- **Commercial (5)**: Lead, Opportunity, Quotation, QuotationItem, CommercialActivity.
- **Business Data (10)**: Client, ClientContact, Vessel, Inspector, InspectorQualification, InspectorAvailability, Country, Port, ServiceType, Currency.
- **Operations (7)**: Job, JobAssignment, Inspection, InspectionReport, JobMilestone, JobStatusHistory, OperationalNote.
- **Finance (5)**: Invoice, InvoiceItem, Expense, Payment, CollectionActivity.
- **Documents (3)**: Document, DocumentCategory, DocumentVersion.
- **Communications (2)**: Notification, Comment.
- **Governance (2)**: ActivityLog, AuditLog.

Deliberadamente **no incluidas**: `BusinessUnit` (ver domain-overview.md), `ExpenseItem`, `AccountsReceivableEntry`/`AccountsPayableEntry` (derivadas, no entidades — ver financial-model.md), `RolePermission` como tabla propia, `EmailRecord`, `Mention` — todas documentadas como conceptos futuros o valores derivados, no como omisiones accidentales.

---

## 4. Relaciones y cardinalidades

Documentadas por contexto en [docs/domain/relationships.md](./docs/domain/relationships.md), con un diagrama `erDiagram` de Mermaid por contexto (Identity & Access, Organization, Commercial, Business Data, Operations, Finance, Documents, Communications & Governance). Todas las relaciones son por ID técnico — ninguna entidad anida objetos completos de otra.

---

## 5. Diagramas

[docs/domain/diagrams.md](./docs/domain/diagrams.md) consolida: un `flowchart` general simplificado del flujo completo (Lead → Job → Invoice → Closure), los 8 `erDiagram` por contexto (mismos que en relationships.md), y 3 `stateDiagram-v2` para las dimensiones `operationalStatus`/`reportStatus`/`billingStatus` del Job.

---

## 6. Ciclos de vida y estados

[docs/domain/lifecycle-and-statuses.md](./docs/domain/lifecycle-and-statuses.md) define:

- Flujo comercial completo: estados y transiciones de `Lead`, `Opportunity` y `Quotation`, con autorización y reglas por transición.
- **Job Lifecycle rediseñado en 3 dimensiones independientes** (no 4): `operationalStatus` (7 estados), `reportStatus` (6 estados, derivado de las Inspections hijas), `billingStatus` (7 estados, derivado de Invoice/Payment). Se documenta explícitamente **por qué NO existe `paymentStatus`** como campo propio del Job — es 100% derivable de `billingStatus` y agregar un cuarto campo crearía una segunda fuente de verdad para el mismo hecho.
- Matriz de combinaciones válidas/inválidas entre dimensiones, y requisitos de historial (`JobStatusHistory`, append-only) y autorización por rol.

---

## 7. Catálogo de reglas de negocio

35 reglas formales en [docs/domain/business-rules.md](./docs/domain/business-rules.md), agrupadas en Commercial (7), Jobs (7), Reports (4), Finance (7), Security (5), Deletion (5) — cada una marcada `[dominio]` (a validar en código en Fase 3) o `[proceso]` (operativa, no bloqueante en código).

---

## 8. Matriz de roles y permisos

[docs/domain/roles-and-permissions.md](./docs/domain/roles-and-permissions.md): matriz conceptual Ver/Crear/Modificar/Archivar × 8 roles (`super_admin`, `admin`, `operations`, `commercial`, `finance`, `shareholder`, `inspector`, `client`) × las entidades de cada contexto. Explícitamente soporta múltiples roles por usuario. `AuditLog` nunca es editable/eliminable por nadie, incluido `super_admin`.

---

## 9. Estrategia de identificadores

[docs/domain/identifiers.md](./docs/domain/identifiers.md): ID técnico recomendado **UUIDv7** (mejor performance de índice que UUIDv4, sin exponer un contador secuencial como un autoincremental) + código visible legible (`JOB-BMC-2026-0142`, etc.) para Job/Quotation/Invoice/Expense, nunca usado como clave técnica. Cubre reinicio anual, inclusión de compañía (sí) y de tipo de servicio/región (no, por ser mutable), generación atómica para evitar colisiones de concurrencia, y la regla de que un código anulado nunca se reutiliza.

---

## 10. Modelo financiero

[docs/domain/financial-model.md](./docs/domain/financial-model.md): distingue valores primarios (Expense, Inspector Fee acordado) de derivados (Revenue, Cash Received, Accounts Receivable, Profitability), con las fórmulas de AR y Profitability por Job explícitas. `Money` como value object (`amountMinor` entero + `currency`) para evitar los errores de punto flotante y el problema de monedas sin decimales (CLP).

---

## 11. Estrategia de monedas

Catálogo mínimo USD/EUR/GBP/CLP (`Currency`, ISO 4217), modelo por transacción con `currency` original + `amountConverted`/`fxRate`/`fxRateDate`/`fxRateSource` opcionales hacia la moneda de reporte de la Company — el monto original siempre es la fuente de verdad legal.

---

## 12. Estrategia de fechas y zonas horarias

[docs/domain/dates-and-timezones.md](./docs/domain/dates-and-timezones.md): `IsoTimestamp` (UTC, con hora) para eventos del sistema vs. `IsoDate` (sin hora) para fechas de negocio — evita que un `dueDate`/`scheduledDate` se corra un día al cruzar zonas horarias. Zonas horarias siempre IANA (`America/Santiago`), nunca offsets fijos.

---

## 13. Modelo documental

[docs/domain/document-model.md](./docs/domain/document-model.md): `Document` único y reutilizable con 18 categorías catalogadas, relación polimórfica (`DocumentLink`) hacia cualquier entidad, versionado inmutable (`DocumentVersion`), 4 niveles de visibilidad y bandera de sensibilidad independiente.

---

## 14. Activity Log vs. Audit Log

[docs/domain/audit-and-activity.md](./docs/domain/audit-and-activity.md): `ActivityLog` es legible-por-negocio y visible para cualquier rol con acceso a la entidad; `AuditLog` es técnico, inmutable y exclusivo de `super_admin`, disparado solo por acciones críticas (cambios de permisos, anulaciones, acceso a documentos sensibles, cambios de datos bancarios).

---

## 15. Archivos TypeScript creados

58 archivos en `src/domain/` (ver árbol en sección 2). Estrategia de tipado documentada y aplicada consistentemente: `XxxId` branded types (`common/identifiers.ts`), `Money`/fechas ISO desde `common/`, relaciones siempre por ID, sin `any` en ningún archivo. Se creó `Domain Entity` + `Create Input`/`Update Input` para las entidades con formularios previsibles a corto plazo (Job, Quotation, Invoice, Client, Lead, Opportunity, etc.); se omitió el input de creación en entidades generadas exclusivamente por el sistema (`JobStatusHistoryEntry`, `ActivityLogEntry`, `AuditLogEntry`, `DocumentVersion`) — documentado inline en cada archivo, no una omisión silenciosa.

---

## 16. Conflictos detectados contra `src/lib/supabase/types.ts`

Se inspeccionó el archivo completo antes de finalizar el modelo. **No se modificó nada en él.** Conflictos conceptuales identificados (a resolver en Fase 3, no en esta fase):

| Tipo actual (Fase 1) | Mapea conceptualmente a (Fase 2) | Naturaleza del conflicto |
|---|---|---|
| `Inspection` (`inspections` table) | **`Job`**, no `Inspection` | La tabla actual mezcla datos del compromiso completo (`client_name`, `vessel_name`, `service_type`, `status` único) con una ejecución puntual — es el caso "Opción 1" descartado en domain-overview.md. Migrar requiere separar en `Job` + `Inspection` (1:N). |
| `InspectionAssignment` | **`JobAssignment`** | Conceptualmente correcto (asignación de inspector a "el trabajo"), pero hoy apunta a `inspection_id` que en realidad es un Job. |
| `InspectionReport` (Fase 1) | Parcialmente **`InspectionReport`** (Fase 2) | Incompatible en profundidad: la Fase 1 no distingue Job de Inspection, así que un reporte hoy no puede diferenciar entre visitas múltiples del mismo Job. |
| `Invoice` (Fase 1: inspector sube su factura) | **No es el mismo concepto que** `Invoice` (Fase 2: factura a cliente) | Homónimo, no equivalente — Fase 1's `Invoice` es más cercano a `DocumentCategory.inspector_invoice` (ver open-decisions.md #7) que a la nueva `Invoice`. |
| `Expense` (Fase 1) | Compatible en forma general con **`Expense`** (Fase 2) | La Fase 1 ya tiene `inspection_id`/`inspector_id`/`amount`/`status` — el nuevo modelo añade `expenseCategory` (reimbursable/non-reimbursable/internal), que no existe hoy. |
| `Payment` (Fase 1: pago al inspector) | **No es el mismo concepto que** `Payment` (Fase 2: pago recibido del cliente) | Homónimo con dirección de flujo de dinero opuesta — la Fase 1 paga al inspector, la Fase 2 registra dinero que entra desde el cliente. Requiere nombres distintos en Fase 3 (ej. `InspectorPayment` vs `ClientPayment`) o un campo `direction`. |
| `ProfileRole` (`"admin" \| "inspector"`, enum único) | **`UserRole`/`Role`** (múltiples roles por usuario) | La Fase 1 solo soporta un rol por perfil vía check constraint de Postgres — el nuevo modelo asume 0..N roles por `CompanyMembership`. Requiere migración de datos, no solo de schema. |
| `Availability` | **`InspectorAvailability`** | Único mapeo 1:1 sin conflicto — mismo concepto, mismos campos esenciales. |
| `AdminUser` (read model del RPC `admin_list_users()`) | Compatible con el patrón **Read Model** documentado en `src/domain/README.md` | Sin conflicto — ya sigue la misma filosofía de "vista calculada, no tabla fuente". |

**Ningún archivo de `src/lib/supabase/types.ts` fue editado.** Esta tabla es la entrada principal para diseñar las migraciones de Fase 3.

---

## 17. Confirmación: nada existente se rompió

```
$ npx tsc --noEmit
(sin salida — 0 errores en todo el proyecto, incluidos los 58 archivos nuevos)

$ npx eslint src
(sin salida — 0 errores, 0 warnings)
```

`git status` confirma que las únicas modificaciones de código de esta sesión son archivos nuevos bajo `docs/domain/` y `src/domain/`, más este informe — ningún archivo de `src/app/`, `src/components/`, `src/lib/supabase/`, `src/proxy.ts` ni `supabase/` fue tocado en Fase 2 (las eliminaciones/renombres que aparecen en `git status` son remanentes sin commitear de Fase 1.5/1.6, no de esta sesión).

---

## 18. Decisiones pendientes

14 decisiones documentadas en [docs/domain/open-decisions.md](./docs/domain/open-decisions.md), cada una con contexto, alternativas, recomendación por defecto e impacto de posponerla — ninguna bloquea el diseño de tablas de Fase 3. Los temas más relevantes: Client vs. Billing Customer, duplicación de Client entre compañías, automatización de Quotation→Job, modelado del fee del inspector (campo vs. Expense), y si `RolePermission` debe ser una entidad editable o configuración de código.

---

## 19. Riesgos arquitectónicos

1. **El conflicto Job↔Inspection (sección 16) es el de mayor impacto de todo el modelo.** Migrar la tabla `inspections` actual a `Job` + `Inspection` (1:N) requiere una migración de datos real, no solo de schema — cada fila actual de `inspections` se convierte en un `Job` con exactamente una `Inspection` hija. Vale la pena planificar este script de migración antes de empezar Fase 3, no durante.
2. **`ProfileRole` (un solo rol) → `UserRole` (multi-rol) es un cambio de modelo de autorización, no solo de datos.** Todo el código que hoy revisa `profile.role === "admin"` necesita una capa de compatibilidad o una reescritura coordinada — no es un simple rename de columna.
3. **Los homónimos `Invoice`/`Payment` entre Fase 1 (dirección inspector→Blueseas) y Fase 2 (dirección Blueseas→cliente) son una fuente clara de confusión de equipo** si no se renombran explícitamente antes de escribir código de Fase 3 (ver recomendación en sección 16).
4. **41 entidades es un catálogo grande.** Ninguna se identificó como innecesaria hoy, pero el ritmo de crecimiento del dominio debe vigilarse en Fase 3 para no caer en sobre-modelado de casos que nunca ocurren (ver el criterio ya aplicado para descartar `BusinessUnit`, `ExpenseItem`, `RolePermission` como entidad).
5. **El modelo multiempresa (`companyId`) está preparado pero no probado con una segunda Company real** — la decisión de "duplicar Client entre compañías" (open-decisions.md #2) es la más riesgosa de revertir si se decide mal, porque implica migración de datos, no solo de schema.

---

## 20. Recomendaciones para Fase 3

1. Empezar el diseño de tablas por **Operations** (Job/Inspection/JobAssignment/InspectionReport), porque es donde vive el conflicto de mayor impacto (sección 16, punto 1) — resolverlo primero evita rediseñar el resto del schema después.
2. Escribir el script de migración de datos `inspections` (Fase 1) → `Job` + `Inspection` (Fase 2) **antes** de crear las tablas nuevas, para validar que el mapeo 1:1 propuesto (una fila actual = un Job con una Inspection) cubre el 100% de los datos reales existentes.
3. Decidir el renombrado de los homónimos `Invoice`/`Payment` (sección 16) antes de escribir cualquier migración — es más barato resolverlo en el nombre de la tabla ahora que después de tener código dependiendo de ambos.
4. Usar el catálogo de 35 reglas de negocio ([business-rules.md](./docs/domain/business-rules.md)) como checklist de validaciones a implementar a nivel de servicio de aplicación (no de constraint de base de datos, salvo las marcadas explícitamente como estructurales).
5. Revisar las 14 decisiones abiertas con el negocio antes de fijar el schema — todas tienen una recomendación por defecto que permite avanzar sin bloquear, pero conviene confirmarlas explícitamente en vez de asumir la recomendación por omisión.

---

## Estado de build

Igual que en todas las fases anteriores: el único fallo es la descarga de las tipografías Geist/Geist Mono desde Google Fonts, por falta de salida a internet en este sandbox — no es un error de código, y no se modificó ningún archivo de fuentes en esta fase. Confirmalo con `npm run build` en tu máquina.
