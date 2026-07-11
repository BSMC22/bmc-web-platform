# Entity catalog

41 entidades, organizadas por bounded context. Cada una documenta: propósito, qué representa / qué no representa, campos esenciales y opcionales, relaciones, estados, reglas de negocio, quién puede ver/crear/modificar/eliminar-archivar, y riesgos o decisiones pendientes.

Los permisos usan los roles de [roles-and-permissions.md](./roles-and-permissions.md): `super_admin`, `admin`, `operations`, `commercial`, `finance`, `shareholder`, `inspector`, `client`. "Todos los internos" = super_admin/admin/operations/commercial/finance.

---

## Identity & Access

### User
- **Propósito**: representar una cuenta con credenciales de acceso a Blueseas OS.
- **Representa**: una persona autenticable (login real, hoy vía Supabase Auth).
- **No representa**: un inspector o un contacto de cliente per se — esos son catálogos de Business Data que *pueden* vincularse a un User (ver `Inspector.userId`, `ClientContact.userId`).
- **Campos esenciales**: `id`, `email`, `fullName`, `isActive`, `createdAt`.
- **Campos opcionales**: `phone`, `avatarUrl`, `lastLoginAt`, `locale`.
- **Relaciones**: 1—N `CompanyMembership` (a qué compañías pertenece y con qué roles); 0..1 con `Inspector` y 0..1 con `ClientContact` (referenciados desde esos catálogos, no desde User).
- **Estados**: `active`, `invited` (invitación enviada, sin activar), `disabled`.
- **Reglas de negocio**: un User no puede quedar sin ninguna `CompanyMembership` activa si tiene rol operativo; desactivar un User no elimina su historial de auditoría.
- **Ver**: super_admin/admin ven todos los Users de su(s) Company(s); cada User ve su propio perfil.
- **Crear**: super_admin/admin (vía invitación).
- **Modificar**: super_admin/admin; el propio User sobre su perfil básico.
- **Eliminar/archivar**: nunca hard delete — solo `disabled`, para preservar integridad referencial con auditoría y asignaciones históricas.
- **Riesgos/pendientes**: hoy `profiles.role` es un único valor (`admin`|`inspector`); este modelo asume roles múltiples vía `UserRole` — ver conflicto en el informe final.

### Role
- **Propósito**: catálogo de roles disponibles en la plataforma.
- **Representa**: una etiqueta con significado de negocio (`operations`, `finance`, etc.) que agrupa permisos.
- **No representa**: la asignación real de un rol a un usuario (eso es `UserRole`).
- **Campos esenciales**: `id`, `key` (slug estable, ej. `operations`), `label`, `isSystemRole`.
- **Campos opcionales**: `description`.
- **Relaciones**: 1—N `Permission` (vía tabla puente conceptual `RolePermission`, no listada como entidad propia — ver Open Decisions); 1—N `UserRole`.
- **Estados**: `active`, `deprecated` (para poder retirar un rol sin romper el historial).
- **Reglas de negocio**: los roles del sistema (`super_admin`, `admin`, `operations`, `commercial`, `finance`, `shareholder`, `inspector`, `client`) no pueden eliminarse, solo desactivarse; un rol no puede eliminarse si tiene `UserRole` activos.
- **Ver**: todos los internos.
- **Crear**: super_admin (roles custom, si se habilitan a futuro).
- **Modificar**: super_admin.
- **Eliminar/archivar**: `deprecated` únicamente; nunca hard delete.
- **Riesgos/pendientes**: si Blueseas necesita roles custom por compañía (no solo los 8 del sistema), este catálogo necesita `companyId` opcional — no se implementa aún.

### Permission
- **Propósito**: catálogo de acciones concretas que pueden autorizarse.
- **Representa**: una acción atómica sobre un contexto (ej. `finance.invoice.approve`).
- **No representa**: quién tiene el permiso (eso es la relación Role↔Permission).
- **Campos esenciales**: `id`, `key` (ej. `finance.invoice.approve`), `context`, `action`.
- **Campos opcionales**: `description`.
- **Relaciones**: N—M con `Role`.
- **Estados**: no aplica (catálogo estático).
- **Reglas de negocio**: las claves de permiso siguen el patrón `{context}.{entity}.{action}` para poder generarlas mecánicamente desde la matriz de [roles-and-permissions.md](./roles-and-permissions.md).
- **Ver**: super_admin.
- **Crear/Modificar**: super_admin, vía despliegue de código (no una pantalla de administración en esta fase).
- **Eliminar/archivar**: no aplica en esta fase.
- **Riesgos/pendientes**: por ahora el modelo documenta la matriz permiso↔rol como tabla conceptual (markdown), no como entidad `RolePermission` separada — ver Open Decisions.

### UserRole
- **Propósito**: asignar uno o varios roles a un usuario **dentro de una compañía específica**.
- **Representa**: "este User tiene este Role en esta Company" — permite múltiples roles por persona (ej. admin + finance).
- **No representa**: la pertenencia general a la compañía (eso es `CompanyMembership`, del cual `UserRole` depende).
- **Campos esenciales**: `id`, `companyMembershipId`, `roleId`, `assignedAt`.
- **Campos opcionales**: `assignedBy`, `expiresAt` (para roles temporales, ej. cobertura de vacaciones).
- **Relaciones**: N—1 `CompanyMembership`; N—1 `Role`.
- **Estados**: `active`, `revoked`.
- **Reglas de negocio**: un mismo `CompanyMembership` puede tener varios `UserRole` activos simultáneamente (admin + finance); revocar un rol no borra el historial, cambia el estado.
- **Ver**: super_admin/admin de la compañía correspondiente.
- **Crear**: super_admin/admin (acción `manage_permissions`).
- **Modificar**: super_admin/admin.
- **Eliminar/archivar**: nunca hard delete — `revoked` con fecha.
- **Riesgos/pendientes**: ninguno mayor; es la pieza que reemplaza al enum rígido `ProfileRole` actual.

### CompanyMembership
- **Propósito**: relacionar un `User` con una `Company`.
- **Representa**: "esta persona trabaja/tiene acceso en esta compañía" — la base para luego asignarle roles vía `UserRole`.
- **No representa**: el rol en sí (separado a propósito, para permitir múltiples roles).
- **Campos esenciales**: `id`, `userId`, `companyId`, `status`, `joinedAt`.
- **Campos opcionales**: `title` (cargo, ej. "Operations Manager"), `invitedBy`.
- **Relaciones**: N—1 `User`; N—1 `Company`; 1—N `UserRole`.
- **Estados**: `invited`, `active`, `suspended`, `removed`.
- **Reglas de negocio**: un User puede tener como máximo un `CompanyMembership` activo por Company (no duplicados); remover un membership no elimina el historial de auditoría asociado a ese usuario en esa compañía.
- **Ver**: super_admin/admin de la compañía.
- **Crear**: super_admin/admin (invitación).
- **Modificar**: super_admin/admin.
- **Eliminar/archivar**: `removed`, nunca hard delete.
- **Riesgos/pendientes**: ninguno mayor.

---

## Organization

### Company
- **Propósito**: representar una entidad legal que opera sobre Blueseas OS.
- **Representa**: hoy, Blueseas Marine Consulting LLC; a futuro, cualquier filial o entidad adicional.
- **No representa**: una división interna sin personalidad legal propia (ver "Business Unit: no incluido" en domain-overview.md).
- **Campos esenciales**: `id`, `legalName`, `shortCode` (ej. `BMC`, usado en los códigos visibles), `defaultCurrency`, `isActive`.
- **Campos opcionales**: `taxId`, `address`, `logoUrl`, `timezone`.
- **Relaciones**: 1—N `CompanyMembership`, `Client`, `Job`, `Quotation`, `Invoice`, `Expense`, `Document`; 1—1 `CompanySettings`.
- **Estados**: `active`, `inactive`.
- **Reglas de negocio**: `shortCode` es único e inmutable (se usa en códigos visibles ya emitidos — cambiarlo rompería trazabilidad histórica); toda compañía debe tener al menos un `CompanyMembership` con rol `admin` o `super_admin` activo.
- **Ver**: super_admin ve todas; el resto ve solo la(s) suya(s).
- **Crear**: super_admin.
- **Modificar**: super_admin; admin sobre datos no críticos (logo, dirección).
- **Eliminar/archivar**: solo `inactive` — nunca hard delete (rompería toda la trazabilidad financiera/legal).
- **Riesgos/pendientes**: hoy el sistema opera con una sola compañía implícita — este modelo no fuerza la migración, solo la deja preparada.

### CompanySettings
- **Propósito**: configuración operativa/financiera propia de cada Company.
- **Representa**: parámetros como formato de numeración, moneda de reporte, plantillas de documentos.
- **No representa**: preferencias de un usuario individual.
- **Campos esenciales**: `companyId` (1:1), `jobCodeFormat`, `invoiceNumberFormat`, `reportingCurrency`.
- **Campos opcionales**: `fiscalYearStartMonth`, `defaultPaymentTermsDays`, `logoForDocuments`.
- **Relaciones**: 1—1 `Company`.
- **Estados**: no aplica.
- **Reglas de negocio**: cambios a formatos de numeración no deben afectar códigos ya emitidos (ver [identifiers.md](./identifiers.md)).
- **Ver**: internos de la compañía.
- **Crear**: se crea automáticamente junto con la Company.
- **Modificar**: super_admin/admin.
- **Eliminar/archivar**: no aplica (vive y muere con la Company).
- **Riesgos/pendientes**: ninguno mayor.

---

## Commercial

### Lead
- **Propósito**: registrar un contacto o empresa aún no calificada comercialmente.
- **Representa**: el primer punto de contacto, antes de saber si hay una necesidad real de negocio.
- **No representa**: una necesidad concreta y calificada (eso es `Opportunity`, y un Lead puede no convertirse nunca en una).
- **Campos esenciales**: `id`, `companyId`, `name`, `source`, `status`, `createdAt`.
- **Campos opcionales**: `clientId` (si ya corresponde a un cliente existente en Business Data), `estimatedValue`, `notes`.
- **Relaciones**: 0..1 `Client` (si se vincula a uno existente); 1—N `CommercialActivity`; 0..1 se convierte en `Opportunity`.
- **Estados**: `new`, `contacted`, `qualified`, `disqualified`, `converted`.
- **Reglas de negocio**: un Lead `disqualified` no puede reabrirse (se crea uno nuevo si el contacto vuelve) — evita perder el motivo de descalificación; un Lead solo pasa a `converted` cuando se crea una `Opportunity` desde él.
- **Ver**: commercial, admin, super_admin.
- **Crear**: commercial, admin.
- **Modificar**: commercial (propio o de su equipo), admin.
- **Eliminar/archivar**: archive únicamente (nunca delete — es historial comercial).
- **Riesgos/pendientes**: ninguno mayor.

### Opportunity
- **Propósito**: representar una necesidad comercial concreta con posibilidad real de convertirse en trabajo.
- **Representa**: el "deal" en seguimiento, con valor estimado y probabilidad.
- **No representa**: la oferta formal en sí (eso es `Quotation`, que se genera desde una Opportunity).
- **Campos esenciales**: `id`, `companyId`, `clientId`, `title`, `status`, `estimatedValue` (`Money`), `createdAt`.
- **Campos opcionales**: `leadId` (origen), `expectedCloseDate`, `probability`, `lostReason`, `assignedToUserId`.
- **Relaciones**: N—1 `Client`; 0..1 `Lead` de origen; 1—N `Quotation` (puede tener varias cotizaciones/revisiones); 1—N `CommercialActivity`.
- **Estados**: `open`, `qualification`, `proposal_requested`, `quotation_prepared`, `negotiation`, `won`, `lost`, `cancelled`.
- **Reglas de negocio**: toda Opportunity `lost` debe registrar `lostReason`; una Opportunity `won` debe tener al menos una `Quotation` en estado `accepted`.
- **Ver**: commercial, admin, super_admin; finance en modo lectura (para forecast).
- **Crear**: commercial, admin.
- **Modificar**: commercial (propia/su equipo), admin.
- **Eliminar/archivar**: archive únicamente.
- **Riesgos/pendientes**: definir si `probability` es un campo libre (0–100) o un valor derivado del `status` — se deja como campo libre por simplicidad, documentado como decisión revisable.

### Quotation
- **Propósito**: oferta formal y versionada enviada al cliente.
- **Representa**: un documento comercial con precio, alcance y condiciones — la base legal/comercial de un futuro Job.
- **No representa**: el Job en sí (una Quotation `accepted` genera un Job, pero no lo es).
- **Campos esenciales**: `id`, `companyId`, `opportunityId`, `clientId`, `quotationNumber`, `revisionNumber`, `status`, `currency`, `totalAmount` (`Money`), `createdAt`.
- **Campos opcionales**: `validUntil`, `termsAndConditions`, `sentAt`, `viewedAt`, `acceptedAt`, `rejectedReason`.
- **Relaciones**: N—1 `Opportunity`; N—1 `Client`; 1—N `QuotationItem`; 0..1 genera `Job`; 1—N `Document` (el PDF enviado, versiones).
- **Estados**: `draft`, `under_review`, `approved_internally`, `sent`, `viewed`, `accepted`, `rejected`, `expired`, `cancelled`, `converted`.
- **Reglas de negocio**: ver el detalle completo en [lifecycle-and-statuses.md](./lifecycle-and-statuses.md) (revisiones, aceptación, conversión a Job).
- **Ver**: commercial, admin, super_admin, finance (lectura); client ve solo las suyas (Client Portal, fase futura).
- **Crear**: commercial, admin.
- **Modificar**: commercial (mientras esté en `draft`/`under_review`); ninguna edición después de `sent` — se crea una revisión nueva.
- **Eliminar/archivar**: nunca delete; `cancelled` es el estado terminal para las que no prosperan.
- **Riesgos/pendientes**: cómo versionar revisiones (¿nueva fila con `revisionNumber` incremental bajo el mismo `quotationNumber`, o `quotationNumber` nuevo por revisión?) — ver Open Decisions.

### QuotationItem
- **Propósito**: línea de detalle dentro de una Quotation.
- **Representa**: un concepto cobrable (servicio, ítem, cargo) con cantidad y precio.
- **No representa**: un ítem de Invoice (aunque suelen copiarse 1:1 al facturar, son entidades separadas — ver `InvoiceItem`).
- **Campos esenciales**: `id`, `quotationId`, `description`, `serviceTypeId`, `quantity`, `unitPrice` (`Money`), `lineTotal` (`Money`).
- **Campos opcionales**: `notes`, `sortOrder`.
- **Relaciones**: N—1 `Quotation`; 0..1 `ServiceType`.
- **Estados**: no aplica (hereda el estado de la Quotation contenedora).
- **Reglas de negocio**: `lineTotal` es un valor derivado (`quantity × unitPrice`), no debe almacenarse inconsistente con sus factores — ver [financial-model.md](./financial-model.md) sobre valores derivados.
- **Ver/Crear/Modificar/Eliminar**: mismos permisos que la Quotation contenedora.
- **Riesgos/pendientes**: ninguno mayor.

### CommercialActivity
- **Propósito**: registrar interacciones comerciales (llamada, email, reunión, nota) sobre un Lead u Opportunity.
- **Representa**: el historial de seguimiento comercial.
- **No representa**: un Comment genérico de otro contexto (ver `Comment`, en Communications, para notas libres no comerciales).
- **Campos esenciales**: `id`, `relatedType` (`lead`|`opportunity`), `relatedId`, `type` (`call`|`email`|`meeting`|`note`), `occurredAt`, `createdBy`.
- **Campos opcionales**: `summary`, `outcome`, `nextFollowUpAt`.
- **Relaciones**: polimórfica hacia `Lead` u `Opportunity`.
- **Estados**: no aplica.
- **Reglas de negocio**: ninguna acción comercial relevante (cambio de estado de Opportunity, envío de Quotation) debería quedar sin una `CommercialActivity` o una entrada de `ActivityLog` asociada.
- **Ver/Crear**: commercial, admin.
- **Modificar**: el autor, dentro de una ventana razonable (regla de UI, no de dominio).
- **Eliminar/archivar**: no se elimina — es historial.
- **Riesgos/pendientes**: ninguno mayor.

---

## Business Data

### Client
- **Propósito**: catálogo de empresas cliente.
- **Representa**: la organización con la que Blueseas tiene o tuvo una relación comercial.
- **No representa**: una persona de contacto (`ClientContact`) ni necesariamente quien paga la factura si son distintos (ver Open Decisions: Client vs. Billing Customer).
- **Campos esenciales**: `id`, `companyId`, `legalName`, `isActive`, `createdAt`.
- **Campos opcionales**: `taxId`, `billingAddress`, `defaultCurrency`, `paymentTermsDays`, `industry`.
- **Relaciones**: 1—N `ClientContact`, `Vessel` (buques asociados/operados), `Opportunity`, `Quotation`, `Job`, `Invoice`.
- **Estados**: `active`, `inactive`.
- **Reglas de negocio**: no se puede desactivar un Client con Jobs en curso (`operationalStatus` no terminal).
- **Ver**: todos los internos; client ve solo su propio registro (fase futura).
- **Crear**: commercial, admin.
- **Modificar**: commercial, admin.
- **Eliminar/archivar**: `inactive` únicamente.
- **Riesgos/pendientes**: ver Open Decisions — Client vs Billing Customer, y si un mismo Client real puede/debe duplicarse entre compañías.

### ClientContact
- **Propósito**: persona de contacto dentro de una empresa cliente.
- **Representa**: a quién se le envía la cotización, el reporte o la factura.
- **No representa**: necesariamente un usuario del Client Portal (ver `userId` opcional).
- **Campos esenciales**: `id`, `clientId`, `fullName`, `email`, `isPrimary`.
- **Campos opcionales**: `phone`, `title`, `userId` (si tiene acceso al Client Portal).
- **Relaciones**: N—1 `Client`; 0..1 `User`.
- **Estados**: `active`, `inactive`.
- **Reglas de negocio**: un Client debe tener al menos un `ClientContact` marcado `isPrimary` para poder enviar Quotations/Invoices.
- **Ver**: internos con acceso al Client; el propio contacto (si tiene `userId`).
- **Crear/Modificar**: commercial, admin.
- **Eliminar/archivar**: `inactive`.
- **Riesgos/pendientes**: acceso de múltiples contactos del mismo cliente al Client Portal — ver Open Decisions.

### Vessel
- **Propósito**: catálogo de embarcaciones.
- **Representa**: el buque sobre el que se ejecuta una inspección u otro servicio.
- **No representa**: la relación de propiedad legal (un Vessel puede estar asociado a un Client sin que eso implique propiedad).
- **Campos esenciales**: `id`, `name`, `imoNumber`, `vesselType`.
- **Campos opcionales**: `flag` (país de bandera), `yearBuilt`, `grossTonnage`, `ownerClientId`.
- **Relaciones**: 0..1 `Client` (armador/operador habitual); referenciado desde `Job`/`Inspection`.
- **Estados**: `active`, `inactive` (ej. desguazado).
- **Reglas de negocio**: `imoNumber` es único cuando está presente (no todas las embarcaciones menores tienen IMO).
- **Ver**: todos los internos.
- **Crear/Modificar**: operations, commercial, admin.
- **Eliminar/archivar**: `inactive`.
- **Riesgos/pendientes**: si Blueseas necesita compartir el catálogo de Vessels entre compañías (dato de la industria, no propietario) — se recomienda catálogo global, sin `companyId`.

### Inspector
- **Propósito**: catálogo de profesionales/proveedores que pueden ejecutar servicios.
- **Representa**: la persona o empresa proveedora de inspección, con o sin acceso al sistema.
- **No representa**: un User (ver domain-overview.md, sección "no mezclar").
- **Campos esenciales**: `id`, `fullName`, `isActive`, `inspectorType` (`individual`|`company`).
- **Campos opcionales**: `userId` (si tiene acceso al Inspector Portal), `email`, `phone`, `baseLocation`, `feeCurrency`.
- **Relaciones**: 0..1 `User`; 1—N `InspectorQualification`, `InspectorAvailability`, `JobAssignment`.
- **Estados**: `active`, `inactive`, `blacklisted`.
- **Reglas de negocio**: un Inspector `blacklisted` no puede recibir nuevas `JobAssignment` (regla de negocio, no de autorización técnica).
- **Ver**: operations, admin, super_admin; el propio inspector ve su ficha (Inspector Portal).
- **Crear/Modificar**: operations, admin.
- **Eliminar/archivar**: `inactive`/`blacklisted`, nunca delete (historial de asignaciones).
- **Riesgos/pendientes**: si es individuo o empresa proveedora — ver Open Decisions ("Inspector como individuo o empresa").

### InspectorQualification
- **Propósito**: certificaciones y calificaciones de un Inspector.
- **Representa**: qué tipos de servicio/estándares puede ejecutar (ej. certificación P&I, curso de vetting).
- **No representa**: el documento físico (eso es `Document`, vinculado a esta calificación).
- **Campos esenciales**: `id`, `inspectorId`, `qualificationName`, `issuedDate`.
- **Campos opcionales**: `expiresDate`, `issuingBody`, `documentId`.
- **Relaciones**: N—1 `Inspector`; 0..1 `Document`.
- **Estados**: `valid`, `expired`, `revoked` (derivable de `expiresDate` pero se guarda explícito para poder marcar `revoked` manualmente).
- **Reglas de negocio**: no se debe asignar un Job que requiera una calificación específica a un inspector sin una `InspectorQualification` vigente equivalente (regla a validar en Fase 3, no bloqueante en el dominio).
- **Ver**: operations, admin; el propio inspector.
- **Crear/Modificar**: operations, admin; el propio inspector puede subir evidencia (queda pendiente de aprobación).
- **Eliminar/archivar**: no se elimina, se marca `revoked`/`expired`.
- **Riesgos/pendientes**: ninguno mayor.

### InspectorAvailability
- **Propósito**: ventanas de disponibilidad/no disponibilidad declaradas por el inspector.
- **Representa**: lo que ya existe hoy en Fase 1 (`availability`), sin cambios de intención.
- **No representa**: la asignación confirmada a un Job (eso es `JobAssignment`).
- **Campos esenciales**: `id`, `inspectorId`, `startDate`, `endDate`, `status` (`available`|`unavailable`).
- **Campos opcionales**: `notes`.
- **Relaciones**: N—1 `Inspector`.
- **Estados**: ver campo `status`.
- **Reglas de negocio**: sin cambios respecto al modelo actual.
- **Ver**: operations, admin; el propio inspector.
- **Crear/Modificar/Eliminar**: el propio inspector (sus ventanas); operations/admin en su nombre.
- **Riesgos/pendientes**: ninguno — este es el único catálogo de Business Data que ya tiene equivalente 1:1 en Supabase hoy.

### Country
- **Propósito**: catálogo de países (ISO 3166-1).
- **Representa**: referencia geográfica reutilizable (nacionalidad, bandera de buque, ubicación de puerto/cliente).
- **Campos esenciales**: `id`, `isoCode2`, `isoCode3`, `name`.
- **Campos opcionales**: `region`.
- **Relaciones**: referenciado desde `Port`, `Client`, `Vessel` (bandera).
- **Estados**: no aplica.
- **Ver**: todos.
- **Crear/Modificar**: super_admin (catálogo mantenido por código/seed, no por pantalla en esta fase).
- **Eliminar/archivar**: no aplica.
- **Riesgos/pendientes**: ninguno.

### Port
- **Propósito**: catálogo de puertos.
- **Representa**: ubicación donde se ejecutan inspecciones.
- **Campos esenciales**: `id`, `name`, `countryId`, `unlocode`.
- **Campos opcionales**: `timezone` (IANA — ver [dates-and-timezones.md](./dates-and-timezones.md)), `latitude`, `longitude`.
- **Relaciones**: N—1 `Country`; referenciado desde `Job`/`Inspection`.
- **Estados**: `active`, `inactive`.
- **Reglas de negocio**: `unlocode` único cuando está presente.
- **Ver**: todos.
- **Crear/Modificar**: operations, admin.
- **Eliminar/archivar**: `inactive`.
- **Riesgos/pendientes**: ninguno.

### ServiceType
- **Propósito**: catálogo de tipos de servicio que Blueseas ofrece.
- **Representa**: la clasificación comercial y operativa del trabajo (inspección de carga, auditoría técnica, etc. — ver el sitio público).
- **Campos esenciales**: `id`, `name`, `category`, `isActive`.
- **Campos opcionales**: `description`, `defaultDurationHours`.
- **Relaciones**: referenciado desde `QuotationItem`, `Job`, `Inspection`.
- **Estados**: `active`, `inactive`.
- **Ver**: todos.
- **Crear/Modificar**: admin, commercial, operations.
- **Eliminar/archivar**: `inactive`.
- **Riesgos/pendientes**: si necesita override por compañía — ver domain-overview.md (tabla multiempresa).

### Currency
- **Propósito**: catálogo ISO 4217 de monedas soportadas.
- **Representa**: código, nombre, símbolo y unidades menores de cada moneda operada (mínimo USD, EUR, GBP, CLP).
- **Campos esenciales**: `code` (ISO 4217, ej. `USD`), `name`, `minorUnits` (2 para USD/EUR/GBP, 0 para CLP).
- **Campos opcionales**: `symbol`.
- **Relaciones**: referenciado desde `Money` en todas las entidades financieras.
- **Estados**: `active`, `inactive` (por si se retira soporte a una moneda).
- **Ver**: todos.
- **Crear/Modificar**: super_admin (catálogo, no pantalla en esta fase).
- **Riesgos/pendientes**: ver [financial-model.md](./financial-model.md) para el detalle de `minorUnits` y por qué importa.

---

## Operations

### Job
- **Propósito**: la entidad central — el servicio confirmado que Blueseas debe ejecutar.
- **Representa**: el compromiso comercial y operativo completo con el cliente (ver domain-overview.md).
- **No representa**: una ejecución técnica puntual (eso es `Inspection`, 1—N bajo el Job).
- **Campos esenciales**: `id`, `companyId`, `jobCode`, `clientId`, `serviceTypeId`, `operationalStatus`, `reportStatus`, `billingStatus`, `createdAt`.
- **Campos opcionales**: `quotationId` (origen), `primaryVesselId`, `primaryPortId`, `scheduledDate`, `notes`, `isArchived`, `archivedAt`.
- **Relaciones**: N—1 `Client`, `ServiceType`; 0..1 `Quotation` de origen; 1—N `JobAssignment`, `Inspection`, `Invoice` (normalmente 1, excepcionalmente varias), `Expense`, `Document`, `JobMilestone`, `JobStatusHistory`, `OperationalNote`.
- **Estados**: 4 dimensiones — ver [lifecycle-and-statuses.md](./lifecycle-and-statuses.md).
- **Reglas de negocio**: ver catálogo completo en [business-rules.md](./business-rules.md), sección Jobs.
- **Ver**: todos los internos (con matiz: inspector solo ve Jobs donde tiene `JobAssignment`); client ve solo los suyos (fase futura); shareholder ve agregados, no el detalle operativo completo.
- **Crear**: operations, admin (manual o automático al aceptar una Quotation).
- **Modificar**: operations, admin; finance sobre campos de facturación únicamente.
- **Eliminar/archivar**: nunca delete; `isArchived` como estado final independiente del lifecycle operativo.
- **Riesgos/pendientes**: si `companyId` puede cambiar después de creado el Job — se recomienda que no (inmutable tras confirmación).

### JobAssignment
- **Propósito**: asignar uno o varios inspectores a un Job.
- **Representa**: "este inspector forma parte del equipo de este Job", con un rol dentro del equipo.
- **No representa**: quién ejecutó físicamente una Inspection puntual (ver `Inspection.performedByInspectorIds`, que normalmente es subconjunto de esto).
- **Campos esenciales**: `id`, `jobId`, `inspectorId`, `roleInJob` (`lead`|`support`), `assignedAt`, `status`.
- **Campos opcionales**: `assignedBy`, `feeAgreed` (`Money`), `notes`.
- **Relaciones**: N—1 `Job`; N—1 `Inspector`.
- **Estados**: `proposed`, `confirmed`, `declined`, `removed`.
- **Reglas de negocio**: un inspector `blacklisted` no puede tener nuevas asignaciones (ver `Inspector`); un inspector solo puede ver/actuar sobre sus propias asignaciones.
- **Ver**: operations, admin; el propio inspector (las suyas).
- **Crear**: operations, admin.
- **Modificar**: operations, admin; el inspector puede `confirmar`/`declinar` la propia.
- **Eliminar/archivar**: `removed`, nunca delete (historial de quién trabajó en qué).
- **Riesgos/pendientes**: ninguno mayor.

### Inspection
- **Propósito**: ejecución técnica discreta dentro de un Job.
- **Representa**: una visita/evento de inspección con fecha, lugar y hallazgos propios.
- **No representa**: el compromiso comercial completo (eso es el Job contenedor).
- **Campos esenciales**: `id`, `jobId`, `inspectionType` (`main`|`attendance`|`reinspection`|`follow_up`), `scheduledDate`, `status`.
- **Campos opcionales**: `vesselId` (si difiere del principal del Job), `portId`, `performedByInspectorIds`, `completedAt`, `findingsSummary`.
- **Relaciones**: N—1 `Job`; 0..1 `Vessel`/`Port` propios; 1—N `InspectionReport`, `Document`.
- **Estados**: `scheduled`, `in_progress`, `completed`, `cancelled`.
- **Reglas de negocio**: ver [lifecycle-and-statuses.md](./lifecycle-and-statuses.md) — el `reportStatus` del Job se deriva de sus Inspections.
- **Ver**: mismo criterio que Job; inspector ve solo las suyas.
- **Crear**: operations, admin.
- **Modificar**: operations, admin; el inspector asignado sobre campos de ejecución (fecha real, hallazgos).
- **Eliminar/archivar**: `cancelled`, nunca delete.
- **Riesgos/pendientes**: ninguno mayor (esta es la pieza nueva que separa a Job de lo que hoy es `inspections`).

### InspectionReport
- **Propósito**: el reporte técnico producido por una Inspection.
- **Representa**: el documento con hallazgos, versionado y con flujo de aprobación.
- **No representa**: el archivo físico en sí (eso es `Document`, vinculado).
- **Campos esenciales**: `id`, `inspectionId`, `submittedByInspectorId`, `status`, `submittedAt`.
- **Campos opcionales**: `reviewedBy`, `reviewedAt`, `reviewNotes`, `documentId` (versión actual).
- **Relaciones**: N—1 `Inspection`; 0..1 `Document` (con `DocumentVersion` para el historial de versiones del archivo).
- **Estados**: `pending`, `submitted`, `under_review`, `approved`, `rejected` (vuelve a `pending` para el inspector, con `reviewNotes`).
- **Reglas de negocio**: un reporte enviado no queda aprobado automáticamente; debe quedar trazabilidad de quién revisó y aprobó; una nueva versión no elimina la anterior (ver `DocumentVersion`).
- **Ver**: operations, admin; finance (lectura, para facturar); el inspector autor; client (solo si `approved` y visibilidad lo permite — fase futura).
- **Crear**: el inspector asignado.
- **Modificar (revisión)**: operations, admin.
- **Eliminar/archivar**: nunca delete.
- **Riesgos/pendientes**: si Report se relaciona con Inspection o con Job — se recomienda **Inspection** (ver decisión Job vs Inspection); si el Job tiene una sola Inspection, en la práctica es indistinguible.

### JobMilestone
- **Propósito**: hitos planificados/alcanzados dentro de un Job (ej. "inspector asignado", "reporte entregado", "facturado").
- **Representa**: puntos de control operativo para seguimiento y reportes.
- **No representa**: el historial de cambios de estado (eso es `JobStatusHistory`, más granular y automático).
- **Campos esenciales**: `id`, `jobId`, `milestoneType`, `plannedDate`.
- **Campos opcionales**: `actualDate`, `notes`.
- **Relaciones**: N—1 `Job`.
- **Estados**: `pending`, `achieved`, `missed`.
- **Reglas de negocio**: ninguna bloqueante — es informativo/de seguimiento, no de control de flujo.
- **Ver**: operations, admin, shareholder (agregado).
- **Crear/Modificar**: operations, admin.
- **Eliminar/archivar**: no se elimina.
- **Riesgos/pendientes**: evaluar si esta entidad es necesaria desde el día uno o si `JobStatusHistory` la cubre — se mantiene por ahora porque un milestone puede no coincidir con un cambio de `status` (ej. "cliente confirmó fecha" no es un status).

### JobStatusHistory
- **Propósito**: historial inmutable de cambios de estado del Job (en sus 4 dimensiones).
- **Representa**: quién cambió qué estado, cuándo y desde/hacia qué valor.
- **No representa**: un log genérico de toda actividad (eso es `ActivityLog`, más amplio).
- **Campos esenciales**: `id`, `jobId`, `statusDimension` (`operational`|`report`|`billing`), `fromStatus`, `toStatus`, `changedAt`, `changedBy`.
- **Campos opcionales**: `reason`.
- **Relaciones**: N—1 `Job`.
- **Estados**: no aplica (es en sí un registro histórico).
- **Reglas de negocio**: append-only — nunca se edita ni elimina una fila existente.
- **Ver**: operations, admin, finance (según dimensión).
- **Crear**: el sistema, automáticamente en cada transición.
- **Modificar/Eliminar**: nadie (inmutable).
- **Riesgos/pendientes**: ninguno.

### OperationalNote
- **Propósito**: notas operativas libres sobre un Job, no comerciales.
- **Representa**: contexto operativo (ej. "el buque cambió de muelle", "cliente pidió prioridad").
- **No representa**: un comentario de colaboración general (se solapa conceptualmente con `Comment` de Communications — ver Open Decisions sobre si deben unificarse).
- **Campos esenciales**: `id`, `jobId`, `authorId`, `text`, `createdAt`.
- **Campos opcionales**: `visibility` (`internal`|`client_visible`).
- **Relaciones**: N—1 `Job`.
- **Estados**: no aplica.
- **Ver**: operations, admin; client si `visibility = client_visible` (fase futura).
- **Crear**: operations, admin, commercial.
- **Modificar/Eliminar**: el autor (ventana corta); nadie después.
- **Riesgos/pendientes**: evaluar fusionar con `Comment` genérico — se mantienen separados por ahora porque `OperationalNote` es específico de Job y puede necesitar `visibility`, mientras `Comment` es polimórfico y más simple.

---

## Finance

### Invoice
- **Propósito**: factura emitida a un cliente.
- **Representa**: el documento financiero formal que genera una cuenta por cobrar.
- **No representa**: el pago en sí (eso es `Payment`, N por Invoice).
- **Campos esenciales**: `id`, `companyId`, `clientId`, `invoiceNumber`, `status`, `currency`, `totalAmount` (`Money`), `issueDate`, `dueDate`.
- **Campos opcionales**: `jobId` (normalmente presente; ver excepción abajo), `notes`, `paymentTermsDays`.
- **Relaciones**: N—1 `Client`; 0..1 `Job` (normalmente 1, puede ser null para invoices no operativas — ver regla); 1—N `InvoiceItem`, `Payment`, `CollectionActivity`, `Document`.
- **Estados**: `draft`, `issued`, `sent`, `partially_paid`, `paid`, `overdue`, `voided`.
- **Reglas de negocio**: ver catálogo completo en [business-rules.md](./business-rules.md), sección Finance.
- **Ver**: finance, admin, super_admin; commercial (lectura); client ve solo las suyas (fase futura); shareholder ve agregados.
- **Crear**: finance, admin (manual o generada desde un Job `ready_to_invoice`).
- **Modificar**: finance, admin — nunca el monto original después de `issued` (ver reglas).
- **Eliminar/archivar**: nunca hard delete — `voided` es el equivalente a "anulada" con trazabilidad completa.
- **Riesgos/pendientes**: una Invoice por Job vs. una Invoice para varios Jobs — ver Open Decisions.

### InvoiceItem
- **Propósito**: línea de detalle de una Invoice.
- **Representa**: un concepto facturado, normalmente copiado desde `QuotationItem` o derivado del Job.
- **Campos esenciales**: `id`, `invoiceId`, `description`, `quantity`, `unitPrice` (`Money`), `lineTotal` (`Money`).
- **Campos opcionales**: `sourceQuotationItemId`, `serviceTypeId`.
- **Relaciones**: N—1 `Invoice`; 0..1 `QuotationItem` de origen.
- **Estados**: no aplica.
- **Reglas de negocio**: `lineTotal` derivado, no editable directamente de forma inconsistente.
- **Ver/Crear/Modificar/Eliminar**: mismos permisos que la Invoice contenedora.
- **Riesgos/pendientes**: ninguno mayor.

### Expense
- **Propósito**: costo o gasto relacionado con un Job, inspector o actividad.
- **Representa**: lo que hoy existe en Fase 1, ampliado con clasificación de reembolso.
- **No representa**: el fee acordado con el inspector por el trabajo en sí — eso puede modelarse como un `Expense` de tipo `inspector_fee` o como parte de `JobAssignment.feeAgreed` (ver Open Decisions: facturas de inspectores).
- **Campos esenciales**: `id`, `companyId`, `jobId`, `inspectorId`, `description`, `amount` (`Money`), `expenseCategory` (`internal`|`reimbursable`|`non_reimbursable`), `status`.
- **Campos opcionales**: `incurredOn`, `documentId` (comprobante), `notes`.
- **Relaciones**: N—1 `Job`; N—1 `Inspector`; 0..1 `Document`.
- **Estados**: `submitted`, `approved`, `rejected`, `reimbursed`.
- **Reglas de negocio**: `expenseCategory` determina si el gasto puede trasladarse a la Invoice del cliente (`reimbursable`) o queda como costo interno (`non_reimbursable`/`internal`) — ver [financial-model.md](./financial-model.md).
- **Ver**: finance, operations (propio del Job), admin; el inspector ve las suyas.
- **Crear**: el inspector (las suyas), operations, admin.
- **Modificar (aprobación)**: finance, admin.
- **Eliminar/archivar**: nunca delete tras `approved`.
- **Riesgos/pendientes**: `ExpenseItem` (detalle línea por línea de un Expense) **no se incluye** — un Expense de Fase 1/2 es de monto único; si en el futuro un solo comprobante cubre varios conceptos, se evalúa entonces.

### Payment
- **Propósito**: registrar un pago efectivamente recibido.
- **Representa**: dinero real que entró, aplicado a una o varias Invoices.
- **No representa**: el monto facturado (eso es Invoice.totalAmount, que nunca cambia por un Payment).
- **Campos esenciales**: `id`, `companyId`, `invoiceId`, `amount` (`Money`), `paidAt`, `status`.
- **Campos opcionales**: `bankReference`, `paymentMethod`, `notes`.
- **Relaciones**: N—1 `Invoice` (una Invoice puede tener varios Payments — pago parcial).
- **Estados**: `pending`, `processing`, `paid`, `failed`, `refunded`.
- **Reglas de negocio**: un Payment nunca modifica `Invoice.totalAmount`; la suma de Payments `paid` de una Invoice no debe exceder su `totalAmount` (validación de negocio, no bloqueo técnico en esta fase).
- **Ver**: finance, admin; commercial (lectura); client (lectura de los suyos, fase futura).
- **Crear/Modificar**: finance, admin.
- **Eliminar/archivar**: nunca delete — `refunded` para reversos.
- **Riesgos/pendientes**: ninguno mayor.

### CollectionActivity
- **Propósito**: registrar gestiones de cobranza sobre una Invoice vencida o próxima a vencer.
- **Representa**: el historial de seguimiento de cobro (llamada, email de recordatorio, acuerdo de pago).
- **Campos esenciales**: `id`, `invoiceId`, `type` (`reminder_sent`|`call`|`payment_promise`|`escalation`), `occurredAt`, `createdBy`.
- **Campos opcionales**: `notes`, `promisedPaymentDate`.
- **Relaciones**: N—1 `Invoice`.
- **Estados**: no aplica.
- **Ver/Crear**: finance, admin.
- **Modificar/Eliminar**: no se elimina — es historial.
- **Riesgos/pendientes**: ninguno mayor. `AccountsReceivableEntry` y `AccountsPayableEntry` **no se incluyen como entidades**: AR se deriva de `Invoice.totalAmount − Payments aplicados` (ver financial-model.md) y AP se deriva de `Expense` pendientes de pago a inspectores/proveedores — ambos son *read models* calculados, no tablas fuente.

---

## Documents

### Document
- **Propósito**: modelo documental reutilizable para cualquier archivo del sistema.
- **Representa**: metadata de un archivo (nombre, categoría, visibilidad, aprobación) — no el binario en sí.
- **No representa**: el contenido del archivo (vive en storage; `Document` es la ficha).
- **Campos esenciales**: `id`, `companyId`, `category` (`DocumentCategory`), `fileName`, `visibility`, `currentVersionId`, `uploadedBy`, `uploadedAt`.
- **Campos opcionales**: `expiresAt`, `sensitivityLevel` (`normal`|`sensitive`), `approvedBy`, `approvedAt`.
- **Relaciones**: 1—N `DocumentVersion`; **relación polimórfica N—M con la entidad a la que pertenece** (Job, Inspection, Inspector, Client, InspectorQualification, etc.) vía una tabla puente conceptual `DocumentLink { documentId, relatedType, relatedId }` — así un mismo documento puede asociarse a más de una entidad sin duplicar el archivo.
- **Estados**: `active`, `superseded` (reemplazado por versión nueva), `deleted` (soft).
- **Reglas de negocio**: ver [document-model.md](./document-model.md) para el detalle completo de tipos, visibilidad y reglas.
- **Ver**: según `visibility` (`internal`|`inspector`|`client`|`shareholder`).
- **Crear**: cualquier rol autorizado a subir en ese contexto (`upload`).
- **Modificar**: metadata por admin/operations/finance según categoría; el archivo en sí no se modifica, se versiona.
- **Eliminar/archivar**: soft delete únicamente — evidencia técnica y financiera no se borra físicamente.
- **Riesgos/pendientes**: retención de documentos a largo plazo — ver Open Decisions.

### DocumentCategory
- **Propósito**: catálogo de tipos de documento.
- **Representa**: `quotation`, `purchase_order`, `appointment`, `inspection_report`, `report_attachment`, `photograph`, `invoice`, `inspector_invoice`, `receipt`, `expense_support`, `certificate`, `qualification`, `passport`, `visa`, `bank_document`, `client_document`, `internal_document`, `other`.
- **Campos esenciales**: `key`, `label`, `defaultVisibility`, `requiresApproval` (bool).
- **Relaciones**: referenciado desde `Document`.
- **Ver**: todos.
- **Crear/Modificar**: super_admin (catálogo de código).
- **Riesgos/pendientes**: ninguno.

### DocumentVersion
- **Propósito**: historial de versiones de un mismo Document lógico.
- **Representa**: cada archivo subido en el tiempo bajo el mismo `Document` (ej. reporte v1, v2, v3).
- **No representa**: un Document distinto — todas las versiones comparten `documentId`.
- **Campos esenciales**: `id`, `documentId`, `versionNumber`, `filePath`, `fileSizeBytes`, `uploadedBy`, `uploadedAt`.
- **Campos opcionales**: `checksum`.
- **Relaciones**: N—1 `Document`.
- **Estados**: no aplica (es histórico por definición).
- **Reglas de negocio**: nunca se elimina una versión anterior; `Document.currentVersionId` siempre apunta a la más reciente aprobada/activa.
- **Ver/Crear**: mismos permisos que el Document contenedor.
- **Modificar/Eliminar**: nadie (inmutable una vez subida).
- **Riesgos/pendientes**: ninguno mayor.

---

## Communications

### Notification
- **Propósito**: aviso dirigido a un usuario sobre un evento relevante.
- **Representa**: "inspector asignado", "reporte pendiente de revisión", "factura vencida", etc.
- **Campos esenciales**: `id`, `userId`, `type`, `title`, `isRead`, `createdAt`.
- **Campos opcionales**: `relatedType`/`relatedId` (polimórfico), `readAt`.
- **Relaciones**: N—1 `User`; polimórfica opcional hacia la entidad de origen.
- **Estados**: `unread`, `read`.
- **Ver/Modificar**: el propio usuario (marcar leída).
- **Crear**: el sistema.
- **Eliminar/archivar**: el usuario puede archivar las propias.
- **Riesgos/pendientes**: `EmailRecord` (registro de que se envió un email real) queda como **concepto futuro**, no tipado en esta fase — no hay integración de email todavía.

### Comment
- **Propósito**: nota de colaboración genérica sobre cualquier entidad.
- **Representa**: un comentario libre, polimórfico.
- **No representa**: `OperationalNote` (específico de Job, con `visibility` propia) ni `CommercialActivity` (estructurada, con `type`/`outcome`).
- **Campos esenciales**: `id`, `relatedType`, `relatedId`, `authorId`, `text`, `createdAt`.
- **Campos opcionales**: `editedAt`.
- **Relaciones**: polimórfica.
- **Ver**: según permisos de la entidad relacionada.
- **Crear**: cualquier rol con acceso de lectura a la entidad relacionada.
- **Modificar**: el autor (ventana corta).
- **Eliminar/archivar**: soft delete.
- **Riesgos/pendientes**: `Mention` (@mencionar a otro usuario dentro de un Comment) queda como **concepto futuro**, no tipado.

---

## Governance

### ActivityLog
- **Propósito**: historial visible para usuarios autorizados sobre eventos de negocio.
- **Representa**: "Inspector assigned", "Report uploaded", "Quotation accepted", "Invoice sent" — ver [audit-and-activity.md](./audit-and-activity.md) para la diferencia completa con AuditLog.
- **Campos esenciales**: `id`, `relatedType`, `relatedId`, `action`, `actorId`, `occurredAt`.
- **Campos opcionales**: `summary`, `metadata` (JSON acotado).
- **Relaciones**: polimórfica.
- **Estados**: no aplica (append-only).
- **Ver**: según el rol y la entidad relacionada (un inspector ve el activity log de sus propios Jobs, no de todos).
- **Crear**: el sistema.
- **Modificar/Eliminar**: nadie.
- **Riesgos/pendientes**: definir política de retención (ver [audit-and-activity.md](./audit-and-activity.md)).

### AuditLog
- **Propósito**: registro técnico e inmutable de acciones críticas.
- **Representa**: cambios de permisos, cambios de importe de factura, anulación de factura, acceso/descarga de documento sensible, modificación de datos bancarios.
- **Campos esenciales**: `id`, `entityType`, `entityId`, `action`, `actorId`, `occurredAt`, `previousValue`, `newValue`.
- **Campos opcionales**: `ipAddress`, `userAgent` (consideración futura, no capturado aún).
- **Relaciones**: polimórfica.
- **Estados**: no aplica (append-only, inmutable).
- **Ver**: super_admin únicamente.
- **Crear**: el sistema, automáticamente en las acciones marcadas como críticas (ver [business-rules.md](./business-rules.md)).
- **Modificar/Eliminar**: nadie, nunca — ni siquiera super_admin vía UI.
- **Riesgos/pendientes**: retención a largo plazo y posible necesidad de almacenamiento append-only reforzado (fuera del alcance de esta fase).
