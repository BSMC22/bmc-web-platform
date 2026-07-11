# Blueseas OS — Domain Model (Fase 2)

Esta carpeta contiene el modelo de dominio de Blueseas OS: las entidades del negocio, sus relaciones, estados, reglas y permisos conceptuales — **independiente de Supabase y de cualquier pantalla existente**. Es el diseño que se va a revisar y aprobar antes de diseñar las tablas y migraciones reales (Fase 3).

Nada de esta fase está conectado al código funcional. `src/domain/` son tipos TypeScript nuevos que hoy no importa ningún componente ni página existente.

## Cómo leer esta carpeta

1. **[domain-overview.md](./domain-overview.md)** — empezá acá. Principio central (Job), bounded contexts, la decisión Job vs Inspection, y el análisis multiempresa.
2. **[entity-catalog.md](./entity-catalog.md)** — catálogo completo de las ~38 entidades, con propósito, campos, relaciones, estados, reglas y permisos por entidad.
3. **[relationships.md](./relationships.md)** — cardinalidades entre entidades, con diagramas Mermaid por contexto.
4. **[lifecycle-and-statuses.md](./lifecycle-and-statuses.md)** — el flujo comercial (Lead/Opportunity/Quotation) y el ciclo de vida del Job, con sus 4 dimensiones de estado.
5. **[business-rules.md](./business-rules.md)** — catálogo formal de reglas de negocio.
6. **[roles-and-permissions.md](./roles-and-permissions.md)** — matriz conceptual de permisos por rol y contexto.
7. **[identifiers.md](./identifiers.md)** — estrategia de IDs técnicos y códigos visibles (Job, Quotation, Invoice, Expense).
8. **[financial-model.md](./financial-model.md)** — Revenue, Cash, Expense, AR, Profitability y estrategia de monedas.
9. **[dates-and-timezones.md](./dates-and-timezones.md)** — estrategia de fechas, timestamps y zonas horarias.
10. **[document-model.md](./document-model.md)** — modelo documental reutilizable.
11. **[audit-and-activity.md](./audit-and-activity.md)** — diferencia entre Activity Log y Audit Log.
12. **[open-decisions.md](./open-decisions.md)** — decisiones pendientes, con alternativas y recomendación.
13. **[diagrams.md](./diagrams.md)** — todos los diagramas Mermaid en un solo lugar.

## Convenciones usadas en todo el modelo

- **IDs**: cada entidad tiene un identificador técnico (`XxxId`, tipo `string` con branding de TypeScript) y, cuando aplica, un código visible (`jobCode`, `invoiceNumber`) — nunca se usa el código visible como clave técnica.
- **Dinero**: nunca `number` suelto. Siempre `Money = { amountMinor, currency }` (ver [financial-model.md](./financial-model.md)).
- **Fechas**: timestamps en UTC (`IsoTimestamp`), fechas de negocio sin hora (`IsoDate`) cuando corresponde (ver [dates-and-timezones.md](./dates-and-timezones.md)).
- **Relaciones**: siempre por ID, nunca objetos anidados cargados dentro de otra entidad.
- **Multiempresa**: cada entidad documenta explícitamente si lleva `companyId` o si es catálogo global (ver la sección correspondiente en domain-overview.md).
- **No hay `any`** en ningún archivo de `src/domain/`.

## Qué NO incluye esta fase

Sin tablas nuevas, sin migraciones, sin cambios al esquema actual de Supabase, sin CRUD, sin formularios, sin pantallas nuevas, sin datos reales conectados, sin dependencias nuevas, sin cambios de autenticación ni permisos reales. Ver el informe final de la fase para el detalle de verificación (`tsc`, `lint`, `build`) y los conflictos detectados contra `src/lib/supabase/types.ts`.
