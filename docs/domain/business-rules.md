# Business rules catalog

Reglas de negocio formales, agrupadas por categoría. Las marcadas **[dominio]** deberían validarse a nivel de tipos/servicios en `src/domain/` cuando se implemente Fase 3; las marcadas **[proceso]** son reglas operativas que hoy dependen de disciplina de uso, no de código.

---

## Commercial

1. **[dominio]** Un Lead `disqualified` es un estado terminal — no puede reabrirse; si el contacto retoma interés, se crea un Lead nuevo.
2. **[dominio]** Una Opportunity solo puede pasar a `won` si tiene al menos una Quotation en estado `accepted`.
3. **[dominio]** Toda Opportunity que pasa a `lost` debe registrar `lostReason`.
4. **[dominio]** Una Quotation en `sent` o posterior no se edita — cualquier cambio genera una nueva revisión (`revisionNumber` incremental bajo el mismo `quotationNumber`).
5. **[dominio]** Una Quotation `expired` no puede aceptarse — el cliente debe solicitar una nueva revisión.
6. **[proceso]** Toda Quotation enviada debe adjuntar un `Document` versionado (el PDF real enviado), no solo el registro en base de datos.
7. **[dominio]** La conversión de Quotation `accepted` a `Job` es 1:1 en el caso normal — una Quotation genera como máximo un Job (ver Open Decisions sobre excepciones).

## Jobs

8. **[dominio]** `reportStatus` y las porciones derivadas de `billingStatus` del Job nunca se editan manualmente — se calculan desde sus `Inspection`/`InspectionReport`/`Invoice`/`Payment` hijos.
9. **[dominio]** Un Job no puede pasar `operationalStatus` a `completed` mientras tenga Inspections en `scheduled`/`in_progress`.
10. **[dominio]** Un Job no puede pasar `billingStatus` a `ready_to_invoice` mientras `reportStatus` no sea `approved` (regla general — puede tener excepciones documentadas por tipo de servicio, ver Open Decisions).
11. **[dominio]** `JobAssignment` a un Inspector `blacklisted` está prohibida.
12. **[proceso]** Todo cambio de `operationalStatus`/`reportStatus`/`billingStatus` debe generar una fila en `JobStatusHistory` — sin excepción, incluidas las transiciones automáticas del sistema.
13. **[dominio]** Un Job `cancelled` no puede generar nuevas Inspections ni Invoices.
14. **[dominio]** El `companyId` de un Job es inmutable una vez creado.

## Reports

15. **[dominio]** Un `InspectionReport` enviado (`submitted`) nunca queda `approved` automáticamente — requiere revisión y aprobación explícita de operations.
16. **[dominio]** Un `InspectionReport` `rejected` vuelve al inspector autor (estado `pending`) con `reviewNotes` obligatorias.
17. **[dominio]** Ninguna versión de `DocumentVersion` de un reporte se elimina — las correcciones generan una versión nueva.
18. **[proceso]** El Job se considera "reportado" (para efectos de facturación) solo cuando **todas** las Inspections marcadas como requeridas tienen reporte `approved` — Inspections opcionales (ej. un follow-up no obligatorio) no bloquean.

## Finance

19. **[dominio]** `Invoice.totalAmount` no se modifica después de `issued` — cualquier corrección requiere `voided` + nueva Invoice.
20. **[dominio]** La suma de `Payment` en estado `paid` de una Invoice no debe exceder `Invoice.totalAmount`.
21. **[dominio]** Un `Payment` nunca modifica `Invoice.totalAmount` — son entidades independientes relacionadas, no un solo saldo mutable.
22. **[dominio]** Un `Expense` marcado `reimbursable` puede trasladarse como línea a una Invoice del cliente; uno `non_reimbursable`/`internal` nunca.
23. **[proceso]** Toda `Invoice` `voided` debe registrar motivo y usuario responsable (vía `AuditLog`, no solo el campo de estado).
24. **[dominio]** Accounts Receivable (AR) y Accounts Payable (AP) son valores **derivados**, no entidades almacenadas — ver [financial-model.md](./financial-model.md).
25. **[dominio]** Un `Expense` no puede quedar `reimbursed` sin antes haber estado `approved`.

## Security

26. **[dominio]** Un usuario sin `CompanyMembership` activo en una Company no puede ver ni operar ningún registro con `companyId` de esa Company.
27. **[dominio]** Un `Inspector` con `userId` vinculado solo ve, en el Inspector Portal, los `Job`/`JobAssignment`/`Inspection` donde él mismo está asignado — nunca el catálogo completo.
28. **[dominio]** Un `ClientContact` con `userId` vinculado solo ve, en el Client Portal, las entidades (`Quotation`, `Job`, `Invoice`) donde `clientId` coincide con su propio `Client` — nunca de otros clientes.
29. **[proceso]** Cambios a `UserRole`/`CompanyMembership` (otorgar o revocar acceso) deben quedar en `AuditLog`, no solo en `ActivityLog`.
30. **[dominio]** Acceso o descarga de un `Document` con `sensitivityLevel = sensitive` genera una entrada de `AuditLog`.

## Deletion

31. **[dominio]** Ninguna entidad financiera (`Invoice`, `Payment`, `Expense`) admite hard delete — solo estados terminales (`voided`, `refunded`, etc.).
32. **[dominio]** Ninguna entidad con historial operativo (`Job`, `Inspection`, `InspectionReport`) admite hard delete — solo `cancelled`/`archived`.
33. **[dominio]** `User` nunca se elimina — solo `disabled`, para preservar integridad referencial de auditoría y asignaciones históricas.
34. **[dominio]** `DocumentVersion` es inmutable — ninguna versión previa se elimina ni se sobrescribe.
35. **[dominio]** `JobStatusHistory` y `AuditLog` son append-only — ninguna fila se edita o elimina, bajo ningún rol, incluido `super_admin`.

---

Este catálogo es la base normativa para las validaciones que se implementarán en Fase 3 (a nivel de servicio de aplicación / base de datos, según corresponda) — no se implementa ninguna de estas reglas en código todavía.
