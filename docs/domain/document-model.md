# Document model

Modelo documental único y reutilizable para cualquier archivo del sistema — evita tener un esquema de "adjuntos" distinto por cada módulo (uno para reportes, otro para facturas, otro para pasaportes de inspectores, etc.).

Ver la entidad `Document` completa en [entity-catalog.md](./entity-catalog.md); este documento profundiza en las decisiones de diseño.

---

## Tipos de documento cubiertos (`DocumentCategory`)

| Categoría | Ejemplo de uso | Visibilidad por defecto | ¿Requiere aprobación? |
|---|---|---|---|
| `quotation` | PDF de una Quotation enviada | `client` | No |
| `purchase_order` | Orden de compra del cliente | `internal` | No |
| `appointment` | Carta de nombramiento / designación | `internal` | No |
| `inspection_report` | Reporte técnico de una Inspection | `internal` (hasta aprobación) | **Sí** |
| `report_attachment` | Fotos, anexos técnicos del reporte | `internal` | No (hereda del reporte padre) |
| `photograph` | Evidencia fotográfica suelta | `internal` | No |
| `invoice` | PDF de una Invoice emitida | `client` | No |
| `inspector_invoice` | Factura que el inspector emite a Blueseas | `internal` | **Sí** (finance) |
| `receipt` | Comprobante de pago | `internal` | No |
| `expense_support` | Boleta/factura que respalda un Expense | `internal` | **Sí** (aprobación del Expense) |
| `certificate` | Certificado del buque o del servicio | `client` | No |
| `qualification` | Certificación profesional de un Inspector | `internal` | **Sí** |
| `passport` | Documento de identidad de un Inspector | `internal`, `sensitivityLevel = sensitive` | No |
| `visa` | Visa de viaje de un Inspector | `internal`, `sensitivityLevel = sensitive` | No |
| `bank_document` | Datos bancarios para pago | `internal`, `sensitivityLevel = sensitive` | No |
| `client_document` | Documento provisto por el cliente | `internal` | No |
| `internal_document` | Documento interno sin categoría específica | `internal` | No |
| `other` | Catch-all | `internal` | No |

---

## Relaciones polimórficas

Un `Document` no pertenece a un único tipo de entidad — se vincula mediante una tabla puente conceptual:

```ts
type DocumentLink = {
  documentId: DocumentId;
  relatedType: "job" | "inspection" | "inspector" | "client" | "quotation" | "invoice" | "expense" | "inspectorQualification";
  relatedId: string; // el ID técnico de la entidad relacionada, según relatedType
};
```

Esto permite que, por ejemplo, un mismo certificado de calidad se asocie tanto a una `Inspection` puntual como al `Job` general, sin duplicar el archivo — o que un mismo comprobante respalde un `Expense` y quede también visible desde el `Job` al que pertenece ese gasto.

---

## Versiones

Cada `Document` tiene 1+ `DocumentVersion` (ver entity-catalog.md). Regla central: **nunca se sobrescribe un archivo** — una corrección, una nueva revisión de reporte, o un reemplazo de comprobante siempre crea una `DocumentVersion` nueva con `versionNumber` incremental. `Document.currentVersionId` apunta a la versión vigente; las anteriores quedan accesibles para auditoría.

---

## Niveles de visibilidad

| Visibilidad | Quién puede verlo |
|---|---|
| `internal` | Todos los roles internos con acceso a la entidad relacionada |
| `inspector` | Internos + el/los inspector(es) asignados a esa entidad |
| `client` | Internos + el/los `ClientContact` con acceso al Client Portal, del cliente correspondiente |
| `shareholder` | Internos + rol `shareholder` (documentos agregados/financieros de alto nivel) |

`sensitivityLevel = sensitive` es una bandera **adicional**, independiente de `visibility` — un documento puede ser `visibility: internal` y además `sensitive` (ej. pasaporte de un inspector: solo internos lo ven, y además cada acceso queda registrado en `AuditLog`, ver regla #30 de business-rules.md).

---

## Aprobación

Los tipos marcados "Sí" en la tabla de categorías requieren un flujo de aprobación: el documento entra en un estado `pending_approval` (a nivel de la entidad que lo contiene — ej. `InspectionReport.status`, `Expense.status` — no como un campo separado en `Document` mismo, para no duplicar el concepto de estado). `Document.approvedBy`/`approvedAt` quedan como metadata de conveniencia una vez aprobado.

---

## Expiración

Documentos con vencimiento natural (`qualification`, `visa`) usan `Document.expiresAt`. No hay job automático de notificación en esta fase — se documenta el campo para que Fase 3 pueda construir alertas de vencimiento (ej. "la certificación de este inspector vence en 30 días").

---

## Qué NO incluye esta fase

- No se implementa almacenamiento real (sigue usando el mecanismo de Supabase Storage ya existente en Fase 1, sin cambios).
- No se implementa el flujo de aprobación como UI — solo se documenta el modelo de datos y las reglas.
- No se implementa notificación automática de expiración.
