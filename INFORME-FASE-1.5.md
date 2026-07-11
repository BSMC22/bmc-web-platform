# Informe técnico — Fase 1.5: Architecture Refactor

Fecha: 10 de julio de 2026
Alcance: reorganización de navegación y arquitectura de Blueseas OS, sin funcionalidad nueva, sin cambios de autenticación, sin cambios en Supabase, sin dependencias nuevas.

**No se hizo commit ni push.** Todo lo de abajo está en el working tree, sin confirmar en git, para que lo revises antes de continuar.

---

## Resumen de decisiones (léelo antes del árbol)

1. **Executive Center ya aterrizaba automáticamente** para `admin`/`super_admin` desde Fase 1 (`src/lib/roles.ts` → `ROLE_REDIRECTS`). No hizo falta tocar esa lógica; lo que cambié fue la navegación alrededor para que se sienta como el centro de la plataforma (ver punto 2).

2. **Un solo layout, un solo menú.** Antes, Executive/Operations/Finance tenían cada uno su propio `layout.tsx` con su propio guard y su propio menú angosto (solo sus páginas). Ahora los seis módulos administrativos (Executive, Operations, Master Data, Finance, Analytics, Administration) comparten **un único layout** (`src/app/(shell)/(admin)/layout.tsx`) que hace el guard una sola vez y renderiza **el menú completo definitivo** (el del punto 10 de tu pedido) en todas las pantallas, con la sección activa auto-expandida. Así, estés donde estés, ves todo el mapa de la plataforma — eso es lo que hace que Executive se sienta como el corazón en vez de un módulo más.

3. **KPIs y Users se movieron**, tal como pediste (Analytics independiente de Executive; Users dentro de Administration). Dejé **redirects** en las URLs viejas (`/executive/kpis`, `/executive/users`) para no romper nada que ya hubieras probado.

4. **"Inspecciones" (Fase 1) se mantuvo.** El menú definitivo de Operations que pediste es Dashboard/Jobs/Calendar/Assignments/Reports — no incluye "Inspections". Pero la funcionalidad real de crear inspecciones y asignar inspectores (que sí existe y funciona) vive en `/operations/inspections`. Como no quiero eliminar funcionalidad, la dejé en el menú como un ítem extra, etiquetado "Inspecciones (Fase 1)", hasta que decidas si Jobs/Assignments la absorben en una fase futura.

5. **Commercial Workflow** quedó como un archivo de referencia (`src/lib/workflow.ts`) con el pipeline Opportunity→Quotation→Approved→Job→Inspection→Invoice→Payment documentado como tipo/constante. No está conectado a ninguna pantalla — es solo la "arquitectura preparada" que pediste, sin lógica.

6. **Workspaces**: conceptualmente ya estaba resuelto desde Fase 1 (cada módulo es su propio layout + sidebar + dashboard independiente = un workspace). No agregué la palabra "Workspace" en las etiquetas visibles porque tu propio menú definitivo (punto 10) usa los nombres cortos ("Executive Center", "Operations", etc.) sin esa palabra — si querés que aparezca explícitamente en la UI, decímelo y lo ajusto.

---

## Árbol actualizado

### `src/app` (solo lo relevante a Blueseas OS)

```
src/app/(shell)/
├── layout.tsx                          ← root layout (sin cambios)
├── login/page.tsx                      ← sin cambios
│
├── (admin)/                            ← NUEVO route group: hub administrativo unificado
│   ├── layout.tsx                      ← NUEVO — layout único (guard + menú completo)
│   │
│   ├── executive/
│   │   ├── page.tsx                    ← sin cambios de contenido
│   │   ├── kpis/page.tsx               ← NUEVO — redirect a /analytics/kpis
│   │   └── users/page.tsx              ← NUEVO — redirect a /administration/users
│   │
│   ├── operations/
│   │   ├── dashboard/page.tsx          ← sin cambios (real)
│   │   ├── inspections/page.tsx        ← sin cambios (real)
│   │   ├── jobs/page.tsx               ← NUEVO placeholder
│   │   ├── calendar/page.tsx           ← NUEVO placeholder
│   │   ├── assignments/page.tsx        ← NUEVO placeholder
│   │   └── reports/page.tsx            ← NUEVO placeholder
│   │
│   ├── finance/
│   │   ├── dashboard/page.tsx          ← sin cambios (real)
│   │   ├── invoices/page.tsx           ← sin cambios (real)
│   │   ├── expenses/page.tsx           ← sin cambios (real)
│   │   ├── payments/page.tsx           ← NUEVO placeholder
│   │   ├── accounts-receivable/page.tsx← NUEVO placeholder
│   │   └── profitability/page.tsx      ← NUEVO placeholder
│   │
│   ├── analytics/                      ← NUEVO módulo
│   │   ├── kpis/page.tsx               ← MOVIDO desde executive/kpis (contenido idéntico)
│   │   ├── reports/page.tsx            ← NUEVO placeholder
│   │   └── dashboards/page.tsx         ← NUEVO placeholder
│   │
│   ├── administration/                 ← NUEVO módulo
│   │   ├── users/page.tsx              ← MOVIDO desde executive/users (lógica idéntica)
│   │   ├── roles/page.tsx              ← NUEVO placeholder
│   │   ├── permissions/page.tsx        ← NUEVO placeholder
│   │   ├── settings/page.tsx           ← NUEVO placeholder
│   │   └── audit-logs/page.tsx         ← NUEVO placeholder
│   │
│   └── master-data/                    ← NUEVO módulo (8 placeholders)
│       ├── clients/page.tsx
│       ├── contacts/page.tsx
│       ├── vessels/page.tsx
│       ├── inspectors/page.tsx
│       ├── ports/page.tsx
│       ├── countries/page.tsx
│       ├── service-types/page.tsx
│       └── companies/page.tsx
│
├── shareholder/                        ← sin cambios (fuera del hub admin, persona distinta)
│   ├── layout.tsx
│   └── dashboard/page.tsx
└── client/                             ← sin cambios (fuera del hub admin, persona distinta)
    ├── layout.tsx
    └── dashboard/page.tsx
```

`[lang]/portal/**` (Inspector Portal, bilingüe) — **sin ningún cambio.**

### `src/components`

```
src/components/
├── administration/            ← NUEVO (movidos desde executive/, misma lógica)
│   ├── invite-user-form.tsx
│   └── user-role-form.tsx
├── executive/
│   └── ai-brief.tsx            ← sin cambios (se quedó, es contenido de /executive)
├── finance/                    ← sin cambios
├── operations/                 ← sin cambios
├── shared/
│   └── app-shell.tsx           ← MODIFICADO (ver detalle abajo)
└── ui/
    └── coming-soon.tsx         ← NUEVO (placeholder reutilizable)
```

### `src/lib`

```
src/lib/
├── navigation-os.ts            ← NUEVO — menú definitivo (OS_NAV, OS_PORTAL_LINKS)
└── workflow.ts                 ← NUEVO — Commercial Workflow (solo tipo/constante, sin uso)
```

---

## Rutas creadas

**Placeholders nuevos (21):**
`/operations/jobs`, `/operations/calendar`, `/operations/assignments`, `/operations/reports`,
`/finance/payments`, `/finance/accounts-receivable`, `/finance/profitability`,
`/analytics/reports`, `/analytics/dashboards`,
`/administration/roles`, `/administration/permissions`, `/administration/settings`, `/administration/audit-logs`,
`/master-data/{clients,contacts,vessels,inspectors,ports,countries,service-types,companies}`

**Movidas (contenido/lógica sin cambios):**
`/executive/kpis` → `/analytics/kpis` · `/executive/users` → `/administration/users`

**Redirects nuevos (compatibilidad hacia atrás):**
`/executive/kpis` → `/analytics/kpis` (307) · `/executive/users` → `/administration/users` (307)

**Sin cambios:** todas las rutas reales de Fase 1 (`/executive`, `/operations/dashboard`, `/operations/inspections`, `/finance/dashboard`, `/finance/invoices`, `/finance/expenses`, `/login`, `/shareholder/dashboard`, `/client/dashboard`, y todo `[lang]/**`).

---

## Layouts creados

| Archivo | Qué hace |
|---|---|
| `src/app/(shell)/(admin)/layout.tsx` | **Nuevo.** Único guard (`requireAdminOrRedirect`) + único menú (`AppShell` con `sections`/`portalLinks`) para los 6 módulos administrativos. |

**Eliminados** (reemplazados por el de arriba, misma protección, cero pérdida de guard): `executive/layout.tsx`, `operations/layout.tsx`, `finance/layout.tsx`.

**Sin cambios:** `shareholder/layout.tsx`, `client/layout.tsx` (personas distintas, siguen con su propio layout + menú simple "Panel"), `[lang]/portal/(protected)/layout.tsx`, `(shell)/layout.tsx`.

---

## Sidebars actualizados

`AppShell` (`components/shared/app-shell.tsx`) ahora soporta **dos modos**, elegidos por qué prop le pasás — no rompe a quien ya lo usaba:

- **Modo plano** (`navItems`): el que ya usaban Shareholder y Client. **Sin cambios de comportamiento.**
- **Modo anidado** (`sections` + `portalLinks`): nuevo. Muestra las 6 secciones del menú definitivo siempre visibles; la sección donde estás parado se expande mostrando sus hijos; al final del sidebar hay un bloque "Portales" con links a Inspector/Client/Shareholder Portal.

No hubo rediseño visual: mismos colores, misma tipografía, mismo ancho de sidebar — solo se agregó un nivel de indentado para los hijos de la sección activa.

---

## Placeholders agregados

Todos usan el mismo componente (`ComingSoon`, en `components/ui/coming-soon.tsx`) para no duplicar layout de "página vacía": título + descripción corta + un `Panel` con la leyenda "Próximamente" y tag "Demo". 21 páginas en total (ver "Rutas creadas" arriba).

---

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/shared/app-shell.tsx` | Se agregaron los tipos `AppShellNavSection`, `AppShellNavChild`, `AppShellPortalLink` y el modo de render anidado. `moduleLabel`/`navItems` pasaron a ser opcionales (antes eran obligatorios) — retrocompatible. |
| `src/app/(shell)/(admin)/executive/page.tsx` | Un solo link actualizado: `href="/executive/users"` → `/administration/users`. |

## Archivos nuevos

- `src/app/(shell)/(admin)/layout.tsx`
- 21 páginas placeholder (listadas arriba)
- `src/app/(shell)/(admin)/executive/kpis/page.tsx` y `.../executive/users/page.tsx` (redirects)
- `src/components/administration/{invite-user-form,user-role-form}.tsx` (movidos desde `components/executive/`, sin cambios de lógica, solo de ubicación e import path)
- `src/components/ui/coming-soon.tsx`
- `src/lib/navigation-os.ts`
- `src/lib/workflow.ts`

## Archivos/carpetas movidos (no eliminados)

- `(shell)/executive/`, `/operations/`, `/finance/` → ahora viven dentro de `(shell)/(admin)/`
- `(shell)/(admin)/executive/kpis/` → contenido movido a `(shell)/(admin)/analytics/kpis/`
- `(shell)/(admin)/executive/users/` → contenido movido a `(shell)/(admin)/administration/users/`
- `components/executive/invite-user-form.tsx`, `user-role-form.tsx` → `components/administration/`

Nada se borró de forma definitiva: donde una URL vieja podía quedar rota, dejé un redirect.

---

## Dependencias

Sin cambios. `package.json` y `package-lock.json` no tienen diferencias contra el último commit — cero paquetes nuevos, como pediste.

## Autenticación / Supabase

Sin cambios. `requireAdminOrRedirect()` es exactamente la misma función de Fase 1, ahora llamada una sola vez (antes se llamaba 3 veces, una por cada layout). No se tocó ninguna tabla, política ni función de Supabase.

---

## Estado de TypeScript

```
$ npx tsc --noEmit
(sin salida — 0 errores)
```

## Estado de `npm run lint`

```
$ npx eslint src
(sin salida — 0 errores, 0 warnings)
```

## Estado de `npm run build`

Igual que en Fase 1: compila el 100% del código y falla únicamente al intentar descargar la tipografía Geist desde Google Fonts, porque este sandbox no tiene salida a internet hacia `fonts.googleapis.com`. No es un error del código — confirmalo corriendo `npm run build` en tu máquina.

Verificación adicional que sí pude hacer en este entorno: levanté el servidor de desarrollo y confirmé que `/executive` y `/operations/jobs` (sin sesión) redirigen correctamente a `/login` con `HTTP 307` — el guard nuevo funciona igual que antes en los 6 módulos. `/login` sigue sirviendo el CSS correctamente.

---

## No se hizo

Ningún `git add`, `git commit` ni `git push`. Todo el árbol de arriba está en tu working directory, sin confirmar, a la espera de que lo revises.
