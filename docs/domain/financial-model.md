# Financial model (conceptual)

Modelo conceptual de los valores financieros del negocio — qué se almacena como fuente primaria y qué se calcula (read model). Ningún cálculo se implementa en código en esta fase.

---

## Conceptos y su naturaleza (primario vs. derivado)

| Concepto | Naturaleza | Fórmula / fuente |
|---|---|---|
| **Revenue** (Ingreso) | Derivado | Suma de `Invoice.totalAmount` (estado `issued` en adelante, excluyendo `voided`) por período |
| **Cash Received** | Derivado | Suma de `Payment.amount` en estado `paid` por período |
| **Expense** | Primario | `Expense.amount`, capturado directamente por quien incurre el gasto |
| **Inspector Fee** | Primario (parte), derivado (agregado) | El monto acordado por Job vive en `JobAssignment.feeAgreed`; el total pagado a un inspector en un período es derivado (suma de `Expense`/pagos tipo `inspector_fee` asociados) |
| **Reimbursable Expense** | Primario (clasificación), derivado (agregado facturable) | `Expense.expenseCategory = reimbursable`; el monto que se traslada a una Invoice es una copia a `InvoiceItem`, no el mismo registro |
| **Non-Reimbursable Expense** | Primario | `Expense.expenseCategory = non_reimbursable` o `internal` — nunca se traslada a una Invoice |
| **Accounts Receivable (AR)** | Derivado | Ver fórmula abajo |
| **Accounts Payable (AP)** | Derivado | Suma de `Expense` `approved` y no `reimbursed`, agrupado por Inspector/proveedor |
| **Profitability** (por Job) | Derivado | Ver fórmula abajo |

### Fórmula de Accounts Receivable

```
AR(cliente, período) = Σ Invoice.totalAmount (estado issued..overdue, excluye voided)
                      − Σ Payment.amount (estado paid, de esas Invoices)
```

AR nunca se almacena como campo — se calcula en el momento de la consulta (read model), por cliente, por Job o agregado por compañía.

### Fórmula de Profitability por Job

```
Profitability(job) = Revenue(job) − Costs(job)

Revenue(job)  = Σ Invoice.totalAmount de las Invoices del Job (excluye voided)
Costs(job)    = Σ Expense.amount de todos los Expense del Job
              + Σ JobAssignment.feeAgreed de los inspectores asignados
                (si el fee no se modela como Expense — ver Open Decisions)

Margin %(job) = Profitability(job) / Revenue(job)
```

Esta fórmula es conceptual — la decisión de si el fee del inspector se modela como una fila de `Expense` con `expenseCategory = internal` o como un campo aparte (`JobAssignment.feeAgreed`) queda documentada como pendiente en [open-decisions.md](./open-decisions.md), porque afecta si esta fórmula suma un campo o dos.

---

## Money: por qué no `number` suelto

Nunca se usa un `number` de JavaScript/TypeScript para representar dinero. Razones:

1. **Precisión de punto flotante**: `0.1 + 0.2 !== 0.3` en IEEE 754 — inaceptable en cálculos financieros donde el error se acumula (sumas de muchas líneas de factura, conversión de monedas).
2. **Monedas con distinta cantidad de decimales**: USD/EUR/GBP usan 2 decimales, pero CLP (peso chileno) usa **0 decimales** — un modelo que asuma "todo tiene centavos" corrompe silenciosamente los montos en CLP.

### El tipo `Money`

```ts
type Money = {
  amountMinor: number; // entero, en la unidad menor de la moneda (centavos para USD, unidades enteras para CLP)
  currency: CurrencyCode; // ISO 4217, ej. "USD" | "EUR" | "GBP" | "CLP"
};
```

- `amountMinor` es siempre un **entero** (nunca decimal) — para USD, `$10.50` se representa como `{ amountMinor: 1050, currency: "USD" }`; para CLP, `$10.500` (sin decimales) se representa como `{ amountMinor: 10500, currency: "CLP" }`.
- El número de "unidades menores por unidad mayor" (2 para USD/EUR/GBP, 0 para CLP) vive en el catálogo `Currency.minorUnits` — nunca hardcodeado en la lógica de formateo.
- Nunca se suman dos `Money` de distinta `currency` directamente — requiere conversión explícita primero (ver estrategia de FX abajo).

---

## Currency / Exchange rate model

### Catálogo mínimo (ISO 4217)

`USD`, `EUR`, `GBP`, `CLP` como mínimo, catalogados en la entidad `Currency` ([entity-catalog.md](./entity-catalog.md)), con posibilidad de agregar más sin cambios estructurales.

### Modelo por transacción

Toda entidad financiera (`Quotation`, `Invoice`, `Expense`, `Payment`) registra:

| Campo | Propósito |
|---|---|
| `currency` | la moneda **original** de la transacción (en la que se negoció/emitió) |
| `amountOriginal` (`Money`) | el monto en la moneda original |
| `reportingCurrency` | la moneda de reporte de la Company (`CompanySettings.reportingCurrency`) |
| `amountConverted` (`Money`, opcional) | el monto ya convertido a la moneda de reporte, si difiere de `currency` |
| `fxRate` | la tasa usada para la conversión, si aplica |
| `fxRateDate` | fecha a la que corresponde la tasa (normalmente la fecha de la transacción) |
| `fxRateSource` | de dónde vino la tasa (ej. "ECB", "manual", proveedor futuro) |

**Regla clave**: `amountOriginal` es siempre la fuente de verdad legal (lo que dice la factura/cotización real); `amountConverted` es un valor de conveniencia para reportes agregados y puede recalcularse, pero no reemplaza al original.

Esto es un modelo conceptual — no se implementa un servicio de tasas de cambio en esta fase (ver [open-decisions.md](./open-decisions.md) sobre fuente de tasas FX).

---

## Reglas de consistencia (ver también business-rules.md)

- `InvoiceItem.lineTotal` y `QuotationItem.lineTotal` son derivados de `quantity × unitPrice` — no se almacenan de forma inconsistente con sus factores.
- `Invoice.totalAmount` es la suma de sus `InvoiceItem.lineTotal` — inmutable después de `issued`.
- Ningún cálculo financiero se hace mezclando `Money` de distinta moneda sin pasar explícitamente por conversión.
