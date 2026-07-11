# Open decisions

14 decisiones que este modelo deja documentadas pero no resueltas de forma definitiva — requieren una respuesta de negocio antes o durante Fase 3. Cada una incluye contexto, alternativas, una recomendación (no vinculante) e impacto si se decide después en vez de ahora.

---

### 1. Client vs. Billing Customer

**Contexto**: en algunos casos el cliente operativo (quien recibe el servicio, ej. el operador del buque) no es quien paga la factura (ej. una gestora de flota o un tercero pagador).
**Alternativas**: (a) `Client` cubre ambos roles con un campo opcional `billingCustomerId` que apunta a otro `Client`; (b) crear una entidad `BillingCustomer` separada; (c) ignorar el caso hasta que ocurra.
**Recomendación**: (a) — campo opcional en `Invoice` (`billTo: ClientId`, distinto de `Job.clientId`), sin nueva entidad.
**Impacto de no decidir ahora**: bajo — se puede agregar el campo opcional a `Invoice` sin migración destructiva.
**Estado**: pendiente de confirmación de negocio.

### 2. Duplicación de Client entre compañías

**Contexto**: si Blueseas opera con más de una Company legal, un mismo cliente del mundo real (ej. "Maersk") ¿es un registro `Client` por compañía o uno compartido?
**Alternativas**: (a) duplicar el registro por compañía (aislamiento total, alineado con la regla de `companyId` obligatorio); (b) un catálogo global de "empresas del mundo real" con relaciones `Client` por compañía.
**Recomendación**: (a) por ahora — más simple, y hoy solo existe una Company real.
**Impacto de no decidir ahora**: medio — si se opta por (b) más adelante, requiere una migración de datos (no solo de schema).
**Estado**: pendiente, revisar cuando exista una segunda Company real.

### 3. Automatización de Quotation `accepted` → Job

**Contexto**: hoy se documenta como transición manual ("commercial registra la aceptación"), pero podría automatizarse (ej. el cliente acepta desde un portal y el Job se crea solo).
**Alternativas**: (a) manual con confirmación humana (más control, más lento); (b) automático desde un trigger de negocio.
**Recomendación**: (a) para el lanzamiento inicial de Fase 3 — automatizar después de validar el flujo con uso real.
**Impacto**: bajo — es un cambio de proceso, no de modelo de datos.
**Estado**: pendiente, decidir en Fase 3.

### 4. Umbral de aprobación interna de Quotation

**Contexto**: se documentó que `under_review → approved_internally` requiere aprobación de "admin, o commercial senior según monto" sin definir el umbral.
**Alternativas**: (a) un monto fijo en USD; (b) porcentaje sobre el promedio histórico; (c) sin umbral, siempre requiere admin.
**Recomendación**: (a) monto fijo, configurable en `CompanySettings`.
**Impacto**: bajo — es una regla de aplicación, no de estructura de datos.
**Estado**: pendiente de definición de negocio.

### 5. Revisiones de Quotation: ¿mismo número o número nuevo?

**Contexto**: ver [identifiers.md](./identifiers.md) — una Quotation editada después de `sent` genera una revisión, pero no se definió si usa el mismo `quotationNumber` con `revisionNumber` incremental o un número totalmente nuevo.
**Alternativas**: (a) mismo `quotationNumber`, `revisionNumber` incremental (ej. `QT-BMC-2026-0087` v1, v2); (b) número nuevo cada vez.
**Recomendación**: (a) — más claro para el cliente y para reportes de conversión.
**Impacto**: medio — afecta el diseño de la tabla de secuencias en Fase 3.
**Estado**: pendiente, pero con recomendación clara.

### 6. Fee del inspector: ¿campo o Expense?

**Contexto**: ver [financial-model.md](./financial-model.md) — el fee acordado con un inspector puede vivir en `JobAssignment.feeAgreed` (campo) o representarse como una fila de `Expense` (`expenseCategory: internal`).
**Alternativas**: (a) campo en `JobAssignment` + un `Expense` generado al momento de pagar; (b) todo vive en `Expense` desde el inicio, `JobAssignment` solo referencia el acuerdo.
**Recomendación**: (a) — separa "lo acordado" de "lo efectivamente pagado", más trazable.
**Impacto**: medio — afecta la fórmula de Profitability y las tablas de Fase 3.
**Estado**: pendiente de validación con Finance.

### 7. Facturas de inspectores (Inspector Invoice)

**Contexto**: `DocumentCategory.inspector_invoice` está catalogado, pero no hay una entidad `InspectorInvoice` formal — hoy se trata como un `Document` adjunto a un `Expense`.
**Alternativas**: (a) mantenerlo como documento adjunto (más simple); (b) crear una entidad `InspectorInvoice` con su propio ciclo de aprobación, separado de `Expense`.
**Recomendación**: (a) para el volumen actual — revisar (b) si el número de inspectores/facturas crece significativamente.
**Impacto**: bajo a corto plazo, medio si se pospone demasiado (migración de datos si se separa después).
**Estado**: pendiente, revisar con volumen real.

### 8. Inspector: ¿individuo o empresa proveedora?

**Contexto**: `Inspector.inspectorType` (`individual`|`company`) ya lo contempla, pero no está definido cómo se manejan inspectores que son una empresa con varios profesionales bajo ella (¿se modela cada profesional como un `Inspector` separado vinculado a una "empresa proveedora", o la empresa completa es un solo `Inspector`?).
**Alternativas**: (a) cada profesional es un `Inspector` individual, con un campo opcional `providerCompanyName` de texto libre; (b) una entidad `InspectorCompany` separada, con `Inspector.companyId` apuntando a ella.
**Recomendación**: (a) para esta fase — no hay evidencia de que Blueseas necesite gestionar la empresa proveedora como entidad propia todavía.
**Impacto**: medio si se necesita (b) después (requiere backfill de datos).
**Estado**: pendiente, revisar con casos reales de proveedores corporativos.

### 9. Acceso de múltiples ClientContact al Client Portal

**Contexto**: ¿todos los `ClientContact` de un `Client` pueden tener acceso al portal, o solo el marcado `isPrimary`?
**Alternativas**: (a) cualquier `ClientContact` puede tener `userId` y acceso independiente; (b) solo el contacto primario tiene acceso, y comparte credenciales internamente (no recomendado).
**Recomendación**: (a) — ya está soportado por el modelo (`ClientContact.userId` es 1:1 opcional por contacto), no requiere cambios, solo confirmación de política de negocio.
**Impacto**: ninguno en el modelo — es una decisión de política de acceso, no de estructura.
**Estado**: pendiente de confirmación, sin impacto técnico.

### 10. Fuente de tasas de cambio (FX)

**Contexto**: [financial-model.md](./financial-model.md) documenta el modelo de `fxRate`/`fxRateSource` pero no de dónde vienen las tasas.
**Alternativas**: (a) carga manual por finance; (b) integración con un proveedor externo (ej. API de banco central, ECB, servicio de FX); (c) tasa fija mensual acordada internamente.
**Recomendación**: (a) para el lanzamiento — más simple y sin dependencias nuevas; evaluar (b) si el volumen de transacciones multi-moneda crece.
**Impacto**: bajo — el modelo de datos ya soporta cualquiera de las tres sin cambios (el campo `fxRateSource` es libre).
**Estado**: pendiente de decisión operativa.

### 11. RolePermission como entidad propia

**Contexto**: [roles-and-permissions.md](./roles-and-permissions.md) documenta la matriz de forma conceptual (markdown), sin una tabla `RolePermission` real.
**Alternativas**: (a) mantener la matriz como configuración de código/constantes (más simple, cambios requieren deploy); (b) modelarla como entidad editable desde una pantalla de administración (más flexible, más complejo).
**Recomendación**: (a) para el lanzamiento de Fase 3 — los 8 roles son estables y conocidos; revisar (b) si se necesitan roles custom por compañía.
**Impacto**: medio — (b) requiere una pantalla de administración completa que no está en el alcance actual.
**Estado**: pendiente, recomendación clara de posponer.

### 12. Unificar OperationalNote y Comment

**Contexto**: ambas entidades cubren "texto libre asociado a una entidad", con diferencias sutiles (`OperationalNote` es específico de Job con `visibility`; `Comment` es polimórfico y genérico).
**Alternativas**: (a) mantenerlas separadas (como está documentado); (b) unificar en una sola entidad `Note` polimórfica con `visibility` opcional.
**Recomendación**: (a) por ahora — el caso de uso de Job con visibilidad hacia el cliente es suficientemente distinto; revisar unificación si aparecen más contextos con necesidad de "nota con visibilidad".
**Impacto**: bajo — unificarlas después es un refactor de modelo, no una migración de datos compleja.
**Estado**: pendiente, sin urgencia.

### 13. Retención de ActivityLog vs. AuditLog

**Contexto**: [audit-and-activity.md](./audit-and-activity.md) documenta que `AuditLog` debe conservarse el máximo tiempo posible, sin definir una política concreta (¿cuántos años? ¿archivado en frío después de X tiempo?).
**Alternativas**: (a) retención indefinida desde el inicio; (b) retención de N años en la base activa + archivado externo después.
**Recomendación**: (a) para el volumen actual (bajo) — revisar (b) cuando el volumen de datos lo justifique.
**Impacto**: bajo a corto plazo, alto si se decide tarde y hay que migrar datos históricos a un archivo frío retroactivamente.
**Estado**: pendiente, sin urgencia inmediata.

### 14. Automatización completa Job → Invoice

**Contexto**: `billingStatus = ready_to_invoice` se documenta como derivado, con "confirmado por finance" como paso manual — no está definido si en el futuro la Invoice se genera 100% automáticamente al cumplirse las condiciones.
**Alternativas**: (a) finance siempre confirma manualmente antes de emitir (más control); (b) generación automática con posibilidad de editar antes de `issued`.
**Recomendación**: (a) para el lanzamiento — permite detectar casos límite (Jobs con alcance no estándar) antes de automatizar.
**Impacto**: bajo — (b) es una mejora de proceso sobre el mismo modelo de datos, no requiere cambios estructurales.
**Estado**: pendiente, revisar después de operar Fase 3 con datos reales.

---

Ninguna de estas 14 decisiones bloquea el diseño de tablas de Fase 3 — todas tienen una recomendación por defecto documentada arriba que permite avanzar, dejando la puerta abierta a ajustar sin romper el modelo si el negocio decide distinto.
