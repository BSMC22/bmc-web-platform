# Identifier strategy

Cada entidad relevante tiene **dos identificadores distintos, con propósitos que nunca se mezclan**:

1. **ID técnico**: clave primaria interna, tipo `UUID` (recomendado **UUIDv7** — ver justificación abajo). Nunca visible en documentos legales/comerciales, nunca usado como número de referencia hablado con el cliente.
2. **Código visible** (solo en las entidades que lo necesitan: `Job`, `Quotation`, `Invoice`, `Expense`, `Payment`): un string legible, secuencial dentro de un ámbito, mostrado en PDFs, comunicaciones y pantallas.

El código visible **nunca es la clave técnica** — todas las relaciones (`jobId`, `invoiceId`, etc.) usan el ID técnico. Esto permite corregir o reemitir un código visible sin romper ninguna relación.

---

## Por qué UUIDv7 y no UUIDv4 ni autoincremental

- **Autoincremental (`serial`/`bigserial`)**: simple, pero filtra volumen de negocio (un competidor puede inferir cuántos Jobs se crean por mes viendo dos números consecutivos) y es mala práctica exponerlo en URLs públicas del Client/Shareholder Portal.
- **UUIDv4**: aleatorio puro, resuelve el problema de exposición, pero es pésimo para performance de índices en Postgres (inserciones dispersas en el B-tree) a medida que el volumen crece.
- **UUIDv7 (recomendado)**: incluye un timestamp ordenable en los primeros bits, así que los inserts quedan naturalmente ordenados en el índice (mejor performance que UUIDv4) sin exponer un contador secuencial adivinable. Es el estándar recomendado hoy para IDs técnicos en sistemas nuevos con Postgres.

Esta es una recomendación para Fase 3 (cuando se diseñen las tablas reales) — no se implementa generación de IDs en esta fase, solo se documenta el tipo (`XxxId` como `string` con branding TypeScript, ver `src/domain/common/identifiers.ts`).

---

## Formato del código visible

Patrón general: `{PREFIJO}-{COMPANY_SHORTCODE}-{AÑO}-{SECUENCIA}`

| Entidad | Prefijo | Ejemplo |
|---|---|---|
| Job | `JOB` | `JOB-BMC-2026-0142` |
| Quotation | `QT` | `QT-BMC-2026-0087` |
| Invoice | `INV` | `INV-BMC-2026-0231` |
| Expense | `EXP` | `EXP-BMC-2026-0512` |
| Payment | (interno, sin código visible obligatorio — ver más abajo) | — |

`Payment` no necesariamente necesita un código visible propio en la primera versión: se referencia por su Invoice (`INV-BMC-2026-0231 / Pago 1 de 2`). Se documenta como decisión abierta si el negocio pide un folio de pago independiente (ver [open-decisions.md](./open-decisions.md)).

---

## Análisis de casos límite

### Reinicio anual
La secuencia (`0142`) se reinicia en `0001` el 1 de enero de cada año, dentro de cada combinación `{prefijo}-{companyShortCode}`. Esto mantiene los códigos cortos y legibles a largo plazo, a costa de que el código por sí solo no basta para ordenar cronológicamente entre años (hay que mirar el `{AÑO}` incluido en el propio código, que sí resuelve esto).

### Inclusión de compañía
El `shortCode` de la Company (ver `Company.shortCode` en [entity-catalog.md](./entity-catalog.md)) se incluye siempre, incluso hoy que solo existe una compañía — evita tener que re-emitir/migrar códigos históricos si Blueseas agrega una segunda entidad legal en el futuro.

### Inclusión de tipo de servicio o región
**Se decide NO incluir** el tipo de servicio ni la región en el código visible. Razón: un Job puede cambiar de alcance/tipo de servicio principal durante su ejecución (raro, pero posible), y el código ya fue comunicado al cliente — incluir un dato mutable en un identificador inmutable es un antipatrón. Si se necesita filtrar/reportar por tipo de servicio o región, se hace por los campos reales (`serviceTypeId`, `portId`), no parseando el código.

### Riesgo de colisión y concurrencia
La secuencia debe generarse con un mecanismo atómico a nivel de base de datos (ej. una tabla `NumberSequence` con `UPDATE ... RETURNING` dentro de una transacción, o una secuencia nativa de Postgres por `{prefijo}-{companyId}-{año}`) — nunca calculada en la aplicación leyendo el "último número" y sumando 1, porque dos requests concurrentes generarían el mismo código. Este mecanismo se diseña en Fase 3; en esta fase solo se documenta el requisito.

### Correcciones
Si un código visible fue emitido con un error tipográfico o de secuencia, **no se reutiliza ni se edita** — el registro pasa a un estado terminal (`voided`/`cancelled`) y se emite un código nuevo. El código erróneo queda visible en el historial como "anulado", nunca se borra ni se reasigna a otro registro (evita confusión en auditorías y comunicación con el cliente).

### Cancelaciones
Un Job/Quotation/Invoice cancelado **conserva su código visible** — no se libera para reutilización. Esto es intencional: un código reutilizado en un documento legal/financiero (factura, cotización) sería un riesgo de auditoría grave si alguna vez se referenció externamente (email al cliente, comprobante de pago).

### Importación histórica
Si en el futuro se migran registros históricos (de otro sistema o de la operación previa a Blueseas OS) con sus propios números legados, se recomienda: (a) preservar el número legado en un campo separado (`legacyReferenceCode`, no el `jobCode`/`invoiceNumber` real), y (b) emitir códigos nuevos siguiendo el formato de esta fase para todo registro nuevo desde la fecha de corte — nunca mezclar dos formatos bajo el mismo campo. Esto se documenta como recomendación para Fase 3, no se implementa ahora.

---

## Resumen para `src/domain/common/identifiers.ts`

- `type XxxId = string & { readonly __brand: "XxxId" }` — un branded type por entidad (`JobId`, `InvoiceId`, `ClientId`, etc.), para que TypeScript no permita pasar un `ClientId` donde se espera un `JobId` aunque ambos sean strings en runtime.
- El código visible se modela como un campo normal (`jobCode: string`) dentro de cada entidad — no es un tipo branded, porque nunca se usa como clave de relación.
