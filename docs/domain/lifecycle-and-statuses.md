# Lifecycle and statuses

Este documento define los estados y transiciones de las tres entidades con ciclo de vida más complejo: `Lead`/`Opportunity`/`Quotation` (flujo comercial) y `Job` (ciclo operativo completo, rediseñado en 4 dimensiones).

---

## Flujo comercial

### Lead

```
new → contacted → qualified → converted
              ↘ disqualified
```

| Transición | Quién autoriza | Reglas |
|---|---|---|
| `new → contacted` | commercial | requiere al menos una `CommercialActivity` registrada |
| `contacted → qualified` | commercial | requiere `estimatedValue` o justificación en notas |
| `contacted → disqualified` | commercial, admin | requiere motivo (campo obligatorio en UI, no en el dominio) |
| `qualified → converted` | commercial | automático al crear una `Opportunity` desde este Lead — no se hace manualmente |
| `disqualified → *` | nadie | estado terminal; si el contacto vuelve, se crea un Lead nuevo |

**Historial**: cada transición debe registrar `JobStatusHistory`-equivalente para Lead (o una entrada de `ActivityLog`) — no hay una tabla dedicada de historial de Lead en esta fase; se apoya en `ActivityLog` (ver [audit-and-activity.md](./audit-and-activity.md)).

### Opportunity

```
open → qualification → proposal_requested → quotation_prepared → negotiation → won
                                                                              ↘ lost
   ↘ cancelled (desde cualquier estado no terminal)
```

| Transición | Quién autoriza | Reglas |
|---|---|---|
| `open → qualification` | commercial | |
| `qualification → proposal_requested` | commercial | cliente pidió cotización formal |
| `proposal_requested → quotation_prepared` | commercial | automático al crear la primera `Quotation` en `draft` |
| `quotation_prepared → negotiation` | commercial | la Quotation fue enviada (`sent`) y el cliente respondió con cambios |
| `negotiation → won` | commercial, admin | requiere una `Quotation` en estado `accepted` |
| `* → lost` | commercial, admin | requiere `lostReason` |
| `* → cancelled` | commercial, admin | requiere motivo; solo desde estados no terminales |

**Reglas de conversión**: una Opportunity `won` dispara la creación de un `Job` (manual en esta fase, no automatizado — ver Open Decisions sobre automatización futura). Una Opportunity no puede volver de `won`/`lost`/`cancelled` a un estado anterior; si el negocio se reabre, se crea una Opportunity nueva referenciando la anterior en notas.

### Quotation

```
draft → under_review → approved_internally → sent → viewed → accepted → converted
                                                    ↘ rejected
                                                    ↘ expired
   ↘ cancelled (desde draft/under_review/approved_internally)
```

| Transición | Quién autoriza | Reglas |
|---|---|---|
| `draft → under_review` | commercial | |
| `under_review → approved_internally` | admin, o commercial senior según monto (regla de negocio a definir por umbral — ver Open Decisions) | |
| `approved_internally → sent` | commercial | genera/asocia el `Document` (PDF) enviado |
| `sent → viewed` | sistema | se registra automáticamente si hay tracking de apertura (capacidad futura, no bloqueante) |
| `sent/viewed → accepted` | commercial (registra la aceptación del cliente) | dispara creación de `Job` cuando la Opportunity pasa a `won` |
| `sent/viewed → rejected` | commercial | requiere `rejectedReason` |
| `sent/viewed → expired` | sistema | automático al pasar `validUntil` sin respuesta |
| `accepted → converted` | sistema | automático al crearse el `Job` correspondiente |
| `* → cancelled` | commercial, admin | solo antes de `sent` |

**Regla de inmutabilidad**: una Quotation en `sent` o estado posterior no se edita — cualquier cambio de precio/alcance genera una nueva `revisionNumber` bajo el mismo `quotationNumber` (ver [identifiers.md](./identifiers.md) para el detalle de numeración).

---

## Job Lifecycle

El Job es la entidad con más candidatos a "estado" de todo el dominio. En vez de un único campo `status` (que en Fase 1 ya mezcla conceptos como `pending`/`in_progress`/`completed`/`invoiced`/`paid` en una sola dimensión), este modelo lo separa en **4 dimensiones independientes**, cada una con su propio ciclo y su propio dueño funcional. Esto elimina estados redundantes (ej. no existe un solo `"completed_and_invoiced"`) y permite que Operations, Finance y Reporting avancen a ritmos distintos sin inventar combinaciones nuevas cada vez.

### Las 4 dimensiones

| Dimensión | Dueño funcional | Responde a |
|---|---|---|
| `operationalStatus` | operations | ¿en qué punto del trabajo físico está el Job? |
| `reportStatus` | operations (derivado de las Inspections) | ¿los reportes técnicos están completos y aprobados? |
| `billingStatus` | finance | ¿el Job fue facturado? |
| ~~`paymentStatus`~~ | — | **no se incluye como campo del Job** — ver justificación abajo |

### `operationalStatus`

```
draft → confirmed → scheduled → in_progress → completed
                                             ↘ cancelled (desde cualquier estado no terminal)
   ↘ on_hold (pausable desde scheduled/in_progress, retorna al estado anterior)
```

| Estado | Significado | Quién transiciona |
|---|---|---|
| `draft` | Job creado, aún no confirmado con el cliente/equipo | operations |
| `confirmed` | Cliente y Blueseas confirmaron el servicio | operations, admin |
| `scheduled` | Tiene fecha e inspector(es) asignado(s) | operations |
| `in_progress` | Al menos una Inspection está `in_progress` o `completed` | sistema (derivado) u operations |
| `on_hold` | Pausado por causa externa (clima, disponibilidad del buque, etc.) | operations, admin |
| `completed` | Todas las Inspections requeridas están `completed` | sistema (derivado) |
| `cancelled` | El servicio no se ejecutará | operations, admin — requiere motivo |

### `reportStatus`

```
not_started → in_progress → submitted → under_review → approved
                                                       ↘ rejected → in_progress (vuelve al inspector)
```

| Estado | Significado | Quién transiciona |
|---|---|---|
| `not_started` | Ninguna Inspection tiene reporte cargado | sistema (derivado) |
| `in_progress` | Al menos un `InspectionReport` está en `pending`/`submitted` | sistema (derivado) |
| `submitted` | Todos los reportes requeridos fueron enviados por los inspectores | sistema (derivado) |
| `under_review` | Operations está revisando | operations |
| `approved` | Todos los `InspectionReport` requeridos están `approved` | sistema (derivado) — condición para que `billingStatus` pueda avanzar a `ready_to_invoice` |
| `rejected` | Al menos un reporte fue rechazado y devuelto | operations |

**Regla clave**: `reportStatus = approved` es un valor **derivado**, calculado a partir del estado de todas las `Inspection`/`InspectionReport` hijas del Job — no se edita manualmente (ver decisión Job vs Inspection en domain-overview.md).

### `billingStatus`

```
not_ready → ready_to_invoice → invoiced → partially_paid → paid
                                                           ↘ overdue (si venció sin pago total)
   ↘ voided (desde invoiced/partially_paid/overdue, requiere motivo)
```

| Estado | Significado | Quién transiciona |
|---|---|---|
| `not_ready` | El Job todavía no cumple condiciones para facturar (`reportStatus` no está `approved`, o `operationalStatus` no está `completed`, según la regla de negocio del servicio) | sistema (derivado) |
| `ready_to_invoice` | Cumple condiciones — finance puede generar la Invoice | sistema (derivado), confirmado por finance |
| `invoiced` | Existe al menos una `Invoice` `issued`/`sent` para este Job | finance |
| `partially_paid` | Espejo del estado agregado de los `Payment` de su(s) Invoice(s) | sistema (derivado desde Invoice/Payment) |
| `paid` | Todas las Invoices del Job están `paid` | sistema (derivado) |
| `overdue` | Al menos una Invoice pasó su `dueDate` sin pago total | sistema (derivado) |
| `voided` | La facturación del Job fue anulada | finance, admin — requiere motivo |

### Por qué NO existe `paymentStatus` en el Job

Se evaluó una cuarta dimensión `paymentStatus` en el Job y **se decide no incluirla como campo propio**. El estado de pago ya es 100% derivable desde `Invoice`/`Payment` (`billingStatus` ya refleja `partially_paid`/`paid`/`overdue` a nivel Job, agregando sus Invoices). Agregar un `paymentStatus` separado crearía dos fuentes de verdad para el mismo hecho (¿está pagado?) que podrían desincronizarse. Si se necesita mostrar el estado de pago en una pantalla de Job, se calcula en el momento de leer (read model), no se almacena.

### Matriz de combinaciones válidas (guía, no exhaustiva)

| operationalStatus | reportStatus | billingStatus | ¿Es una combinación normal? |
|---|---|---|---|
| `scheduled` | `not_started` | `not_ready` | Sí — Job recién agendado |
| `in_progress` | `in_progress` | `not_ready` | Sí — trabajo en curso |
| `completed` | `approved` | `ready_to_invoice` | Sí — listo para facturar |
| `completed` | `approved` | `paid` | Sí — ciclo completo |
| `completed` | `rejected` | `not_ready` | Sí — trabajo físico terminado pero el reporte fue rechazado, bloquea facturación |
| `cancelled` | `not_started` | `voided`/`not_ready` | Sí — Job cancelado antes de reportar/facturar |
| `draft` | `approved` | * | **Inválida** — no puede haber reporte aprobado sin que el Job esté al menos `scheduled` |

Esta matriz no se valida a nivel de dominio en esta fase (no hay motor de reglas), pero documenta la intención para Fase 3.

### Requisitos de historial

Todo cambio en cualquiera de las 3 dimensiones almacenadas (`operationalStatus`, `reportStatus`, `billingStatus`) debe generar una fila en `JobStatusHistory` con `statusDimension`, `fromStatus`, `toStatus`, `changedAt`, `changedBy` — es append-only e inmutable (ver `JobStatusHistory` en [entity-catalog.md](./entity-catalog.md)).

### Requisitos de autorización

| Transición de dimensión | Roles autorizados |
|---|---|
| `operationalStatus` (cualquier transición) | operations, admin |
| `reportStatus` (transiciones automáticas) | sistema; `under_review`/`rejected` son manuales por operations |
| `billingStatus → invoiced` en adelante | finance, admin |
| Cualquier transición hacia `cancelled`/`voided` | admin, o operations/finance según dimensión — siempre con motivo obligatorio |
