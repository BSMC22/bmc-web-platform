# Domain overview

## Principio central: el Job

**El Job es la entidad central de Blueseas OS.** Un Job representa un servicio confirmado que Blueseas Marine Consulting se compromete a ejecutar para un cliente — nace cuando una Quotation es aceptada y termina cuando el servicio está completado, reportado, facturado y cobrado.

El flujo general del negocio:

```
Lead → Opportunity → Quotation → Accepted/Won → Job → Inspector Assignment →
Inspection Execution → Report → Invoice → Collection/Payment → Closure
```

No todo depende directamente del Job:

- **Lead y Opportunity** existen *antes* del Job y pueden nunca convertirse en uno (la mayoría no lo hacen — así funciona un embudo comercial).
- **Client, Vessel, Port, Inspector, Service Type** son *Business Data*: catálogos de referencia que el Job consume, pero que existen independientemente y sobreviven a cualquier Job individual.
- **Invoice, Expense, Report, Document, Assignment** sí se relacionan directamente con un Job (son "hijos" operativos o financieros de un Job específico).
- **Payment** se relaciona principalmente con una **Invoice**, no con el Job directamente — un Job puede tener varias Invoices (excepcionalmente) y cada Invoice tiene sus propios Payments.
- **Activity Log** se relaciona con distintas entidades (polimórfico) — no es exclusivo del Job.

Esta distinción es intencional: el dominio no es "todo cuelga de Job". Job es el centro de gravedad *operativo y financiero*, pero Commercial y Business Data tienen su propia vida.

## Bounded contexts

| Contexto | Responsabilidad | Entidades principales |
|---|---|---|
| **Identity & Access** | Quién puede entrar al sistema y qué puede hacer | User, Role, Permission, UserRole, CompanyMembership |
| **Organization** | La(s) empresa(s) legal(es) que operan Blueseas OS | Company, CompanySettings |
| **Commercial** | Todo lo que pasa antes de que exista un Job | Lead, Opportunity, Quotation, QuotationItem, CommercialActivity |
| **Business Data** | Catálogos de referencia reutilizables | Client, ClientContact, Vessel, Inspector, InspectorQualification, InspectorAvailability, Country, Port, ServiceType, Currency |
| **Operations** | La ejecución real del servicio | Job, JobAssignment, Inspection, InspectionReport, JobMilestone, JobStatusHistory, OperationalNote |
| **Finance** | Todo lo relacionado a dinero | Invoice, InvoiceItem, Expense, Payment, CollectionActivity |
| **Documents** | Archivos y evidencia, reutilizable por cualquier contexto | Document, DocumentCategory, DocumentVersion |
| **Communications** | Notificaciones y colaboración | Notification, Comment (EmailRecord y Mention quedan como concepto futuro, no tipados aún) |
| **Governance** | Trazabilidad y auditoría | ActivityLog, AuditLog |

No se incluyó `BusinessUnit` — ver [Business Unit: no incluido](#business-unit-no-incluido) más abajo.

---

## Decisión formal: Job vs. Inspection

Esta es la decisión arquitectónica más importante del modelo. La hipótesis inicial (Job = compromiso comercial/operativo completo, Inspection = ejecución técnica específica dentro de un Job) es correcta, y la analizamos contra las 4 opciones planteadas.

### Opción 1 — Job e Inspection como la misma entidad
La tabla `inspections` actual (Fase 1) hace exactamente esto: mezcla datos del compromiso (`client_name`, `vessel_name`, `service_type`, `status`) con datos de una ejecución puntual. **Descartada**: no puede representar una reinspección, un attendance adicional, un follow-up o varios inspectores en visitas distintas sin duplicar o falsear el registro completo del Job.

### Opción 2 — Job con una Inspection obligatoria (1:1)
Resolvería el caso simple (la mayoría de los servicios de Blueseas hoy) pero sigue sin poder representar una reinspección o un follow-up como eventos propios con su propia fecha, inspector y reporte. **Descartada**: demasiado rígida para los casos reales que Blueseas ya menciona (reinspecciones, follow-ups, varias visitas al buque).

### Opción 3 — Job con una o varias Inspections (1:N) — **recomendada**
- **Job** = el compromiso comercial y operativo completo: un código, un cliente, un service type principal, un estado global, una rentabilidad.
- **Inspection** = cada ejecución técnica discreta dentro de ese Job: una fecha, un lugar/buque, un equipo de inspectores, hallazgos y un reporte propios.
- El caso simple (un Job = una sola visita) sigue siendo válido y es el más común: un Job con exactamente **una** Inspection. El modelo no obliga a nada más complejo cuando no hace falta.
- El caso complejo (inspección principal + attendance + reinspección + follow-up + varias visitas) se representa naturalmente como varias filas de `Inspection` bajo el mismo `Job`.

**Ventajas**: representa la realidad del negocio sin forzar casos simples a ser complejos; permite reportar y facturar por Job aunque hubo varias visitas; permite historial y trazabilidad por visita.
**Desventajas**: más entidades que mantener; requiere decidir dónde vive cada dato (¿el service type es del Job o de cada Inspection? — ver más abajo) y consultas ligeramente más complejas para el caso simple.

### Opción 4 — Otro modelo
Se evaluó introducir un tercer nivel ("Visit" separado de "Inspection") pero se descartó por sobreingeniería: no hay evidencia de que Blueseas necesite distinguir "visita física al puerto" de "evento de inspección" como conceptos separados hoy. Si aparece esa necesidad, `Inspection` puede ganar un campo `visitSequence` sin necesitar una entidad nueva.

### Recomendación final

**Opción 3: Job con una o varias Inspections.** Reglas de diseño derivadas:

- `Job` guarda el Service Type principal, el Client, el Vessel principal y el estado global. Cada `Inspection` puede referenciar su propio Vessel (para casos con varios buques) pero por defecto hereda el del Job.
- `JobAssignment` vive a nivel de Job (quién forma parte del equipo asignado a este compromiso), no a nivel de Inspection. Cada `Inspection` registra opcionalmente qué inspector(es) *ejecutaron* esa visita puntual (`performedByInspectorIds`), que normalmente es un subconjunto de los inspectores asignados al Job.
- `InspectionReport` se relaciona con la `Inspection` (no directamente con el Job) — cada visita produce su propio reporte. El Job puede considerarse "reportado" cuando todas sus Inspections requeridas tienen reporte aprobado (regla de negocio, no un campo redundante).
- La tabla `inspections` actual de Fase 1 pasa a mapear conceptualmente a **Job** (no a Inspection) — ver conflictos detectados en el informe final de esta fase.

---

## Job, Inspector, User y Client Contact — no mezclar

| Entidad | Qué es | Puede existir sin ser User |
|---|---|---|
| **User** | Persona con credenciales de acceso a Blueseas OS (login real, `auth.users`) | No aplica — un User *es* la cuenta |
| **Inspector** | Profesional o proveedor que puede ejecutar servicios | **Sí** — un inspector puede estar en el catálogo (para asignarlo, evaluarlo, pagarle) sin tener nunca acceso al sistema |
| **ClientContact** | Persona de contacto dentro de una empresa cliente | **Sí** — puede recibir cotizaciones e invoices por email sin tener acceso al Client Portal |
| **CompanyMembership** | Relaciona un `User` con una `Company` y uno o varios `Role` | N/A — es la tabla puente, no una persona |

Un `Inspector` **puede** tener un `userId` opcional que lo vincule a un `User` real (cuando ese inspector sí tiene acceso al Inspector Portal). Lo mismo para `ClientContact.userId` (acceso al Client Portal). La relación es opcional y unidireccional desde el catálogo hacia el usuario — nunca al revés (un `User` no "es" un Inspector; un `User` *puede estar vinculado a* un registro de Inspector).

---

## Modelo multiempresa (preparación, no implementación)

Blueseas OS debe estar preparado para una o varias compañías legales (Blueseas Marine Consulting LLC hoy; filiales regionales, otra sociedad del grupo, o incluso otra empresa usando la plataforma en el futuro). **No se implementa multitenancy completo en esta fase** — solo se decide qué entidades necesitan `companyId` desde ya para no tener que agregarlo después con una migración destructiva.

| Entidad | ¿Lleva `companyId`? | Razón |
|---|---|---|
| Client | **Sí** | Un cliente comercial pertenece a la relación con una compañía legal específica de Blueseas, aunque el mismo cliente del mundo real trabaje con dos entidades de Blueseas — se prefiere duplicar el registro de Client antes que compartirlo implícitamente entre compañías (ver [open-decisions.md](./open-decisions.md)) |
| User / CompanyMembership | User **no** lleva `companyId` directo — la relación vive en `CompanyMembership` (un User puede pertenecer a más de una Company) | Permite que una persona trabaje para más de una entidad legal del grupo sin duplicar su cuenta |
| Job | **Sí** | Cada Job se ejecuta y se factura bajo una compañía legal específica |
| Quotation | **Sí** | Se emite en papel membretado de una compañía específica |
| Invoice | **Sí** | Requisito legal/fiscal — una factura pertenece a una única entidad emisora |
| Payment | **Sí** (heredado de la Invoice, pero se guarda explícito para no depender de un join) | Reportes de caja por compañía |
| Expense | **Sí** | Los costos se asignan a la compañía que ejecuta el Job |
| Document | **Sí** | Aislamiento de archivos por compañía, aunque el storage físico pueda compartirse |
| Settings (CompanySettings) | Es 1:1 con Company por definición | — |
| Number Sequences (Job/Quotation/Invoice codes) | **Sí, la secuencia es por compañía y por año** | Evita colisiones de folios entre compañías y es requisito típico de facturación legal |
| Country, Currency, ServiceType (catálogo), Port | **No** (global) — ver nota | Son catálogos de referencia reutilizables. `ServiceType` podría necesitar un override por compañía en el futuro (ej. una filial no ofrece cierto servicio) — se documenta como decisión abierta, no se bloquea el diseño global de hoy |
| Role / Permission (definición) | **No** (global) | El *catálogo* de roles/permisos es global; la *asignación* de un rol a un usuario sí es por compañía, vía `UserRole`/`CompanyMembership` |

### Business Unit: no incluido

Se evaluó `BusinessUnit` (para segmentar una Company en divisiones internas — ej. "Marine" vs "Cargo" dentro de la misma entidad legal) y **se decide no incluirlo en esta fase**. No hay evidencia de que Blueseas necesite ese nivel intermedio hoy; agregarlo prematuramente añadiría un `businessUnitId` opcional a casi todas las entidades operativas sin un caso de uso concreto. Si en el futuro Blueseas necesita reportar rentabilidad por división dentro de la misma compañía legal, se puede introducir entonces — el modelo de `companyId` ya deja el punto de extensión claro (un Job pasaría de `companyId` a `companyId` + `businessUnitId` opcional, sin romper nada existente).
