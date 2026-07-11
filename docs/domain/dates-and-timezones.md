# Dates and timezones strategy

Blueseas opera con clientes, buques e inspectores en distintas zonas horarias (puertos alrededor del mundo). Este documento define cómo se guardan y manejan fechas/horas en el dominio, para evitar el error más común en sistemas operativos internacionales: que una fecha de negocio "se corra" un día por una conversión de zona horaria mal manejada.

---

## Dos tipos de fecha, nunca mezclados

```ts
type IsoTimestamp = string; // instante exacto en UTC, formato ISO 8601 con hora — ej. "2026-07-10T14:32:00.000Z"
type IsoDate = string;      // fecha de negocio, sin hora — ej. "2026-07-10"
```

- **`IsoTimestamp`**: para todo lo que es "cuándo ocurrió un evento en el sistema" — `createdAt`, `updatedAt`, `submittedAt`, `changedAt`. Siempre en **UTC**, siempre con hora.
- **`IsoDate`**: para fechas de negocio que las personas piensan como un día calendario, sin hora asociada, y que **no deben correrse** al cruzar zonas horarias — `scheduledDate` (fecha planeada de una Inspection), `dueDate` (vencimiento de una Invoice), `issueDate`, `expiresDate` (de una calificación).

**Por qué separar**: si `dueDate` se guardara como `IsoTimestamp` en UTC (ej. `2026-07-15T00:00:00Z`), un usuario en Chile (UTC-4) vería esa factura como vencida el 14 de julio a las 20:00, no el 15 — corriendo la fecha de vencimiento real un día hacia atrás en su percepción. Guardarlo como `IsoDate` puro (`"2026-07-15"`) elimina ese problema: es el mismo día calendario en cualquier zona horaria.

---

## Zonas horarias: IANA, nunca offsets fijos

Cuando una entidad necesita asociarse a una zona horaria específica (ej. `Port.timezone`, para mostrar "la inspección es a las 09:00 hora local del puerto"), se usa el nombre de zona **IANA** (`"America/Santiago"`, `"Europe/London"`, `"Asia/Singapore"`), nunca un offset fijo como `"UTC-4"`.

**Razón**: los offsets fijos no manejan horario de verano (DST) correctamente y quedan obsoletos si el país cambia sus reglas de DST — el nombre IANA siempre resuelve al offset correcto para cualquier fecha, pasada o futura.

---

## Reglas de conversión

| Escenario | Regla |
|---|---|
| Guardar un evento del sistema (`createdAt`, cambio de estado) | Siempre `IsoTimestamp` en UTC — la conversión a hora local del usuario ocurre solo en la capa de presentación (UI), nunca en el dominio ni en la base de datos |
| Guardar una fecha de negocio (`scheduledDate`, `dueDate`) | Siempre `IsoDate` puro, sin componente de hora ni zona horaria |
| Mostrar la hora exacta de una Inspection agendada | Se combina `Inspection.scheduledDate` (`IsoDate`) + una hora local opcional + `Port.timezone` (IANA) — nunca se asume la zona horaria del usuario que está viendo la pantalla |
| Reportes financieros por período (ej. "Revenue de julio 2026") | Se define explícitamente en qué zona horaria/calendario se agrupa (recomendado: `CompanySettings` define el calendario fiscal de referencia) — evita ambigüedad de "¿julio según qué zona horaria?" |

---

## Qué NO se hace

- No se usa `Date` de JavaScript como tipo de dominio (es mutable, ambiguo entre fecha/timestamp, y su comportamiento de parseo de strings es notoriamente inconsistente entre entornos). El dominio usa `string` tipado (`IsoTimestamp`/`IsoDate`); la conversión a objetos de fecha con zona horaria ocurre en la capa de UI usando una librería dedicada (a elegir en Fase 3 — no se agrega ninguna dependencia en esta fase).
- No se guardan offsets calculados (`"2026-07-10T09:00:00-04:00"`) como fuente de verdad — si se necesita la hora local de un evento, se deriva combinando el `IsoTimestamp` UTC con la zona IANA relevante en el momento de mostrarlo, no se persiste ya convertido.
