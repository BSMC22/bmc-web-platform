# Informe técnico — Fase 1.6: Commercial Module & Final Navigation Refinement

Fecha: 11 de julio de 2026
Alcance: nuevo módulo Commercial, renombre de Master Data → Business Data (sin tocar URLs), placeholders nuevos en Finance y Administration, documentación de los 3 flujos de negocio separados. Cero lógica nueva, cero CRUD, cero Supabase, cero dependencias nuevas.

**No se hizo commit ni push.** Sigue todo sin confirmar en git (acumulado con Fase 1.5, que tampoco se había commiteado).

---

## 1. Árbol actualizado

`src/app/(shell)/(admin)/` completo (todos los módulos administrativos comparten el layout único de Fase 1.5):

```
(admin)/
├── layout.tsx                          ← sin cambios (guard + AppShell)
│
├── executive/
│   ├── page.tsx                        ← sin cambios
│   ├── kpis/page.tsx                   ← redirect (Fase 1.5, sin cambios)
│   └── users/page.tsx                  ← redirect (Fase 1.5, sin cambios)
│
├── commercial/                         ← NUEVO módulo completo
│   ├── dashboard/page.tsx
│   ├── leads/page.tsx
│   ├── opportunities/page.tsx
│   └── quotations/page.tsx
│
├── operations/                         ← sin cambios de contenido
│   ├── dashboard/page.tsx              (real)
│   ├── jobs/page.tsx                   (placeholder, Fase 1.5)
│   ├── calendar/page.tsx               (placeholder, Fase 1.5)
│   ├── assignments/page.tsx            (placeholder, Fase 1.5)
│   ├── reports/page.tsx                (placeholder, Fase 1.5)
│   └── inspections/page.tsx            (real)
│
├── master-data/                        ← carpeta/URLs sin cambios; label visible → "Business Data"
│   ├── clients/page.tsx
│   ├── contacts/page.tsx
│   ├── vessels/page.tsx
│   ├── inspectors/page.tsx
│   ├── ports/page.tsx
│   ├── countries/page.tsx
│   ├── service-types/page.tsx
│   └── companies/page.tsx
│
├── finance/
│   ├── dashboard/page.tsx              (real)
│   ├── invoices/page.tsx               (real)
│   ├── payments/page.tsx               (placeholder, Fase 1.5)
│   ├── expenses/page.tsx               (real)
│   ├── accounts-receivable/page.tsx    (placeholder, Fase 1.5)
│   ├── collections/page.tsx            ← NUEVO placeholder
│   ├── accounts-payable/page.tsx       ← NUEVO placeholder
│   └── profitability/page.tsx          (placeholder, Fase 1.5)
│
├── analytics/
│   ├── kpis/page.tsx                   (real/demo, movido en Fase 1.5)
│   ├── reports/page.tsx                (placeholder)
│   └── dashboards/page.tsx             (placeholder)
│
└── administration/
    ├── users/page.tsx                  (real, movido en Fase 1.5)
    ├── roles/page.tsx                  (placeholder)
    ├── permissions/page.tsx            (placeholder)
    ├── settings/page.tsx               (placeholder)
    ├── audit-logs/page.tsx             (placeholder)
    └── system-health/page.tsx          ← NUEVO placeholder
```

`src/components/`: sin estructura nueva, solo el ícono `commercial` agregado al mapa de `AppShell`.

`src/lib/workflow.ts`: reescrito para reflejar los 3 flujos separados (ver punto 3).

---

## 2. Rutas nuevas

| Ruta | Módulo | Tipo |
|---|---|---|
| `/commercial/dashboard` | Commercial | Placeholder |
| `/commercial/leads` | Commercial | Placeholder |
| `/commercial/opportunities` | Commercial | Placeholder |
| `/commercial/quotations` | Commercial | Placeholder |
| `/finance/collections` | Finance | Placeholder |
| `/finance/accounts-payable` | Finance | Placeholder |
| `/administration/system-health` | Administration | Placeholder |

Todas usan `ComingSoon` (mismo componente reutilizable de Fase 1.5), todas dentro del hub `(admin)` — heredan el guard y el menú único automáticamente, sin necesitar layout propio.

**Ninguna URL existente cambió.** `master-data/*` sigue en las mismas rutas.

---

## 3. Cambios en navegación

`src/lib/navigation-os.ts` (única fuente de verdad del menú):

- Se insertó la sección **Commercial** entre Executive Center y Operations (icono nuevo: `BriefcaseIcon`), con sus 4 hijos.
- La sección `master-data` cambió su `label` de "Master Data" a **"Business Data"** — `key`, `href` y `basePath` quedaron intactos.
- Finance ganó dos hijos: **Collections** y **Accounts Payable**, ubicados entre "Accounts Receivable" y "Profitability", tal como pediste.
- Administration ganó un hijo: **System Health**, al final de la lista.
- Operations quedó igual que en Fase 1.5 (Dashboard, Jobs, Calendar, Assignments, Reports, Inspecciones (Fase 1)). Sobre el pedido de que "Jobs sea el elemento prioritario": Jobs ya es el segundo ítem, inmediatamente después de Dashboard — no lo puse primero porque tu propio menú objetivo (punto 8 de tu pedido) lista "Dashboard" antes que "Jobs", y todos los demás módulos siguen ese mismo patrón (el primer hijo es el landing/dashboard). Si preferís que Jobs vaya literalmente primero en la lista y sea el destino del link de nivel superior, decímelo y lo cambio.
- Executive Center sigue siendo la primera sección del menú y sigue siendo el destino de login de `admin`/`super_admin` — no toqué esa lógica.
- El menú final (orden real en el sidebar) quedó:

  Executive Center → Commercial → Operations → Business Data → Finance → Analytics → Administration → Portales (Inspector/Client/Shareholder Portal)

  — que coincide con el punto 8 de tu pedido.

`src/lib/workflow.ts` — reescrito (sin uso en UI, solo documentación/tipos) para reflejar los 3 flujos separados en vez del pipeline único de Fase 1.5:

```
Commercial: Lead → Opportunity → Quotation → Won
Operations: Job → Assignment → Inspection → Report → Completion
Finance:    Invoice → Collection → Payment → Profitability
```

No están conectados entre sí ni a ninguna pantalla — es exactamente lo que pediste ("no conectar estos flujos todavía, solo documentar").

---

## 4. Archivos creados

- 7 páginas nuevas (`commercial/{dashboard,leads,opportunities,quotations}`, `finance/{collections,accounts-payable}`, `administration/system-health`) — todas placeholders con `ComingSoon`.

---

## 5. Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/lib/navigation-os.ts` | +sección Commercial, label Master Data→Business Data, +2 hijos en Finance, +1 hijo en Administration |
| `src/components/shared/app-shell.tsx` | +1 entrada en el mapa de íconos (`commercial` → `BriefcaseIcon`) |
| `src/lib/workflow.ts` | Reescrito: de 1 pipeline combinado a 3 flujos separados (Commercial/Operations/Finance) |

No se modificó ningún componente funcional existente (formularios de inspecciones, facturas, gastos, usuarios) ni ninguna página real.

---

## 6. Confirmación: Supabase y autenticación

```
$ git diff HEAD --name-only | grep -iE "supabase|proxy|schema.sql|roles.ts"
(sin resultados)
```

Ningún archivo de `src/lib/supabase/`, `src/proxy.ts`, `supabase/schema.sql` ni `src/lib/roles.ts` (redirección por rol) aparece en el diff desde el último commit. Cero cambios en autenticación, cero cambios en Supabase, cero cambios en permisos reales — se mantiene exactamente como en Fase 1/1.5.

---

## 7. Estado de TypeScript

```
$ npx tsc --noEmit
(sin salida — 0 errores)
```

## 8. Estado de `npm run lint`

```
$ npx eslint src
(sin salida — 0 errores, 0 warnings)
```

## 9. Estado de `npm run build`

Igual que en Fase 1 y 1.5: compila el 100% del código nuevo y existente; el único fallo es la descarga de la tipografía Geist desde Google Fonts, por falta de salida a internet en este sandbox — no es un error de código. Confirmalo con `npm run build` en tu máquina.

---

## 10. Riesgos detectados antes de Fase 2

1. **"Inspecciones (Fase 1)" sigue siendo el único ítem funcional real dentro de Operations**, conviviendo con 4 placeholders (Jobs, Calendar, Assignments, Reports) que conceptualmente deberían reemplazarlo. Cuanto más tiempo pase, más se acumula la tentación de "seguir usando lo viejo" en vez de migrar a Jobs/Assignments — conviene decidir pronto el plan de migración real para Fase 2.

2. **Los 3 flujos de negocio (Commercial/Operations/Finance) todavía no tienen ningún punto de unión documentado más allá de un comentario en `workflow.ts`.** Cuando definan cómo un Job nace de una Quotation "Won", o cómo una Inspección completada genera un Invoice, ese acoplamiento probablemente va a requerir nuevas tablas o foreign keys en Supabase — vale la pena pensarlo antes de empezar a construir Commercial u Operations en profundidad, para no tener que reestructurar de nuevo.

3. **El menú del sidebar ya tiene 7 secciones con hasta 8 hijos cada una (Business Data).** Visualmente sigue siendo manejable porque solo se expande la sección activa, pero si en Fase 2 cada placeholder se convierte en una pantalla real con su propia sub-navegación, va a valer la pena revisar si el sidebar de 3 niveles todavía alcanza o si hace falta un patrón distinto (tabs dentro de cada módulo, por ejemplo).

4. **"Business Data" y "Master Data" conviven como nombres** (label visible vs. nombre técnico de carpeta/URL). Es intencional y de bajo riesgo, pero vale dejarlo anotado para que nadie en el equipo se confunda buscando `/business-data` en el código.

5. **Ningún placeholder tiene todavía un dueño de datos claro** (por ejemplo, ¿"Companies" en Business Data es lo mismo que un futuro "Client"? ¿"Vessels" pertenece a Master Data u Operations?). No es urgente, pero antes de diseñar el schema de Fase 2 conviene mapear qué entidad vive en qué módulo para evitar duplicar conceptos.
