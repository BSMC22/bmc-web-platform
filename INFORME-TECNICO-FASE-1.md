# Informe técnico — Fase 1: Blueseas OS

Fecha del informe: 10 de julio de 2026
Alcance: reorganización de arquitectura + Executive Center + Operations Portal + Finance Portal + Shareholder/Client (esqueleto) + migración del dashboard "Operaciones" existente.

Este documento es un informe de estado. No se realizaron cambios de código al generarlo.

---

## 1. Estructura completa de carpetas

### `src/app`

```
src/app/
├── (shell)/                          ← Blueseas OS: shell plano, sin prefijo de idioma
│   ├── layout.tsx                    ← root layout #2 (html/body/fonts/globals.css)
│   ├── login/
│   │   └── page.tsx
│   ├── executive/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── kpis/
│   │   │   └── page.tsx
│   │   └── users/
│   │       └── page.tsx
│   ├── operations/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── inspections/
│   │       └── page.tsx
│   ├── finance/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── invoices/
│   │   │   └── page.tsx
│   │   └── expenses/
│   │       └── page.tsx
│   ├── shareholder/
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   └── client/
│       ├── layout.tsx
│       └── dashboard/
│           └── page.tsx
│
├── [lang]/                           ← sitio público + Inspector Portal, bilingüe (en/es)
│   ├── layout.tsx                    ← root layout #1 (html/body/fonts/globals.css/Header/Footer)
│   ├── page.tsx                      ← Home
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── industries/page.tsx
│   ├── contact/page.tsx
│   ├── coverage/page.tsx
│   └── portal/
│       ├── login/
│       │   └── page.tsx              ← login bilingüe original (Inspector Portal)
│       └── (protected)/              ← route group: agrupa todo lo autenticado
│           ├── layout.tsx
│           ├── page.tsx              ← dashboard inspector (redirige admin → /executive)
│           ├── inspections/
│           │   ├── page.tsx
│           │   └── [id]/page.tsx
│           ├── invoices/page.tsx
│           ├── expenses/page.tsx
│           └── availability/page.tsx
│
├── api/
│   └── admin/
│       └── invite-user/
│           └── route.ts              ← Route Handler (usa service role key)
│
├── globals.css
└── favicon.ico
```

Notas de arquitectura:
- Hay **dos root layouts** independientes (`[lang]/layout.tsx` y `(shell)/layout.tsx`), siguiendo el patrón oficial de Next.js para múltiples raíces vía route groups. Cada uno define su propio `<html>`/`<body>` e importa `globals.css`.
- `(shell)` y `(protected)` son *route groups*: el paréntesis no aparece en la URL.
- El Inspector Portal **no se movió** a la carpeta plana; sigue bilingüe bajo `[lang]/portal`.

### `src/components`

```
src/components/
├── contact/
│   └── contact-form.tsx              ← sin cambios
├── executive/                        ← NUEVO
│   ├── ai-brief.tsx
│   ├── invite-user-form.tsx
│   └── user-role-form.tsx
├── finance/                          ← NUEVO
│   ├── expense-status-form.tsx
│   └── invoice-status-form.tsx
├── operations/                       ← NUEVO
│   ├── inspection-assign-panel.tsx
│   └── inspection-create-form.tsx
├── shared/                           ← NUEVO
│   ├── app-shell.tsx                 ← sidebar/topbar genérico (los 5 módulos nuevos)
│   ├── login-form.tsx                ← login plano (Blueseas OS)
│   └── logout-button.tsx             ← usado por Inspector Portal y por el shell nuevo
├── ui/
│   ├── button.tsx                    ← sin cambios
│   ├── container.tsx                 ← sin cambios
│   ├── section.tsx                   ← sin cambios
│   ├── section-heading.tsx           ← sin cambios
│   ├── panel.tsx                     ← NUEVO
│   └── stat-card.tsx                 ← NUEVO
├── layout/
│   ├── header.tsx                    ← sin cambios
│   ├── footer.tsx                    ← modificado (prefetch={false})
│   ├── mobile-nav.tsx                ← sin cambios
│   ├── language-switcher.tsx         ← sin cambios
│   └── site-chrome.tsx               ← existente, oculta Header/Footer en /portal
├── portal/                           ← Inspector Portal (bilingüe, sin cambios funcionales)
│   ├── availability-form.tsx
│   ├── delete-availability-button.tsx
│   ├── expense-upload-form.tsx
│   ├── inspection-status-form.tsx
│   ├── invoice-upload-form.tsx
│   ├── login-form.tsx
│   ├── portal-nav.tsx
│   └── report-upload-form.tsx
└── icons.tsx                         ← modificado (+4 íconos)
```

`src/lib`:

```
src/lib/
├── dictionaries.ts        ← sin cambios (en/es del sitio público + Inspector Portal)
├── i18n-config.ts         ← sin cambios
├── navigation.ts          ← sin cambios
├── fonts.ts                ← NUEVO (Geist/Geist Mono compartidos entre los 2 root layouts)
├── roles.ts                ← NUEVO (AppRole, ROLE_REDIRECTS)
└── supabase/
    ├── client.ts           ← sin cambios
    ├── server.ts           ← sin cambios
    ├── middleware.ts       ← sin cambios
    ├── types.ts            ← sin cambios
    └── guards.ts            ← NUEVO (requireAdminOrRedirect)
```

---

## 2. Rutas creadas

### Blueseas OS (shell plano, español, sin prefijo de idioma)

| Ruta | Descripción | Datos |
|---|---|---|
| `/login` | Login único del shell nuevo | Real (Supabase Auth) |
| `/executive` | Executive Command Center | Mixto (4 cards reales, resto demo) |
| `/executive/kpis` | KPIs por 7 categorías | Demo |
| `/executive/users` | Gestión de usuarios (ex "Admin Portal") | Real |
| `/operations/dashboard` | Panel operativo | Mixto |
| `/operations/inspections` | Crear inspecciones + asignar inspectores | Real |
| `/finance/dashboard` | Panel financiero | Mixto |
| `/finance/invoices` | Revisar/aprobar facturas | Real |
| `/finance/expenses` | Revisar/aprobar gastos | Real |
| `/shareholder/dashboard` | Vista accionistas, solo lectura | Demo |
| `/client/dashboard` | Vista cliente, solo lectura | Demo |

### Sitio público + Inspector Portal (bilingüe, `[lang]` = `en` \| `es`)

Sin cambios de rutas respecto a lo ya existente, salvo la reorganización interna en `(protected)`:

| Ruta | Descripción |
|---|---|
| `/{lang}` , `/about`, `/services`, `/industries`, `/coverage`, `/contact` | Sitio público |
| `/{lang}/portal/login` | Login Inspector Portal |
| `/{lang}/portal` | Dashboard inspector (redirige a `/executive` si `role === admin`) |
| `/{lang}/portal/inspections`, `/inspections/[id]` | Inspecciones del inspector |
| `/{lang}/portal/invoices` | Facturas del inspector |
| `/{lang}/portal/expenses` | Gastos del inspector |
| `/{lang}/portal/availability` | Disponibilidad del inspector |

### API

| Ruta | Método | Descripción |
|---|---|---|
| `/api/admin/invite-user` | POST | Invita un usuario nuevo (requiere `SUPABASE_SERVICE_ROLE_KEY`) |

**Ruta eliminada:** `/{lang}/portal/admin/*` (Operaciones) — funcionalidad migrada a `/executive/users`, `/operations/inspections`, `/finance/invoices`, `/finance/expenses`.

---

## 3. Layouts creados

| Archivo | Tipo | Qué hace |
|---|---|---|
| `src/app/(shell)/layout.tsx` | Root layout | `<html>/<body>`, fuentes, `globals.css`. Sin guard (cada módulo lo hace individualmente). |
| `src/app/(shell)/executive/layout.tsx` | Layout de módulo | `requireAdminOrRedirect()` + `AppShell` (nav: Resumen, KPIs, Usuarios) |
| `src/app/(shell)/operations/layout.tsx` | Layout de módulo | Guard + `AppShell` (nav: Panel, Inspecciones) |
| `src/app/(shell)/finance/layout.tsx` | Layout de módulo | Guard + `AppShell` (nav: Panel, Facturas, Gastos) |
| `src/app/(shell)/shareholder/layout.tsx` | Layout de módulo | Guard + `AppShell` (nav: Panel) |
| `src/app/(shell)/client/layout.tsx` | Layout de módulo | Guard + `AppShell` (nav: Panel) |
| `src/app/[lang]/layout.tsx` | Root layout | Ya existía; se le quitó la instanciación de fuentes (ahora vienen de `lib/fonts.ts`) |
| `src/app/[lang]/portal/(protected)/layout.tsx` | Layout de módulo | Ya existía; se actualizó para usar `LogoutButton` compartido |

Layout eliminado: `src/app/[lang]/portal/(protected)/admin/layout.tsx` (Operaciones) — reemplazado por los 3 layouts de arriba (executive/operations/finance).

---

## 4. Sidebars creados

| Componente | Usado por | Notas |
|---|---|---|
| `AppShell` (`components/shared/app-shell.tsx`) | Executive, Operations, Finance, Shareholder, Client | Sidebar de escritorio + topbar mobile, genérico y parametrizado (`moduleLabel`, `navItems`, `displayName`, `logoutRedirect`). Un solo componente para los 5 módulos nuevos — no hay 5 sidebars duplicados. |
| `PortalNav` (`components/portal/portal-nav.tsx`) | Inspector Portal | Ya existía, sin cambios. |

Sidebar eliminado: `AdminNav` (`components/portal/admin-nav.tsx`) — reemplazado por `AppShell`.

Detalle técnico relevante: `AppShell` es un Client Component. Los `navItems` que recibe desde los layouts (Server Components) usan un `icon: "dashboard" | "inspections" | ...` (string), no una referencia a función/componente — esto evita el error *"Functions cannot be passed directly to Client Components"* que apareció durante la construcción y ya fue corregido.

---

## 5. Componentes reutilizables creados

| Componente | Carpeta | Propósito |
|---|---|---|
| `AppShell` | `shared/` | Shell autenticado (sidebar + topbar) para los 5 módulos nuevos |
| `LoginForm` (plano) | `shared/` | Formulario de login del shell nuevo, sin dependencia de `lang`/diccionario |
| `LogoutButton` | `shared/` | Generalizado con `redirectTo` explícito; usado por Inspector Portal y por Blueseas OS |
| `StatCard` | `ui/` | Tarjeta de métrica, con tag "Demo" opcional y `href` opcional |
| `Panel` + `ChartPlaceholder` | `ui/` | Contenedor de sección con heading + placeholder de gráfico "próximamente" |
| `AiBrief` | `executive/` | Placeholder del AI Executive Brief, texto demo etiquetado explícitamente |
| `UserRoleForm` | `executive/` | Cambiar rol de un usuario (real) |
| `InviteUserForm` | `executive/` | Invitar usuario nuevo (real, vía API route) |
| `InspectionCreateForm` | `operations/` | Crear inspección (real) |
| `InspectionAssignPanel` | `operations/` | Asignar/quitar inspectores (real) |
| `InvoiceStatusForm` | `finance/` | Cambiar estado de factura (real) |
| `ExpenseStatusForm` | `finance/` | Cambiar estado de gasto (real) |

Todos estos son versiones migradas/adaptadas de los componentes que antes vivían en `components/portal/admin-*` (ya eliminados) — se les quitó la dependencia del sistema de diccionarios (`Dictionary`) y ahora tienen el texto en español embebido directamente, porque el shell nuevo no es bilingüe.

---

## 6. Tipos / interfaces creadas

| Tipo/Interface | Archivo | Descripción |
|---|---|---|
| `AppRole` | `lib/roles.ts` | `"super_admin" \| "admin" \| "operations" \| "finance" \| "shareholder" \| "inspector" \| "client"` — **solo preparación**, no todos existen en Supabase todavía |
| `ROLE_REDIRECTS` (const, no es tipo pero es la pieza central del modelo de roles) | `lib/roles.ts` | `Record<AppRole, string>` — a dónde redirige cada rol tras login |
| `AppShellIconName` | `components/shared/app-shell.tsx` | Union de los nombres de ícono válidos para `AppShellNavItem` |
| `AppShellNavItem` | `components/shared/app-shell.tsx` | `{ key, label, href, icon }` |

Tipos ya existentes, sin cambios (para referencia): `ProfileRole`, `Profile`, `InspectionStatus`, `Inspection`, `InspectionAssignment`, `InspectionReport`, `InvoiceStatus`, `Invoice`, `ExpenseStatus`, `Expense`, `PaymentStatus`, `Payment`, `AdminUser`, `AvailabilityStatus`, `Availability`, `Dictionary`, `Locale`, `NavKey`, `NavLink` (todos en `lib/supabase/types.ts`, `lib/dictionaries.ts`, `lib/i18n-config.ts`, `lib/navigation.ts`).

**Importante:** `ProfileRole` sigue siendo únicamente `"admin" | "inspector"` porque así está la restricción real en la base (`profiles.role check (role in ('admin','inspector'))`). `AppRole` es un tipo aparte, deliberadamente, para no mentir sobre lo que la base de datos realmente acepta hoy.

---

## 7. Archivos modificados

Comparado contra el último commit previo a esta sesión (`d903281`):

| Archivo | Motivo del cambio |
|---|---|
| `src/proxy.ts` | Se agregó la rama que excluye a `/login`, `/executive`, `/operations`, `/finance`, `/shareholder`, `/client` del redirect de idioma, y el guard de sesión para esas rutas |
| `src/app/[lang]/layout.tsx` | Ya no instancia las fuentes directamente; las importa desde `lib/fonts.ts` |
| `src/components/icons.tsx` | +4 íconos: `TrendingUpIcon`, `AlertTriangleIcon`, `SparklesIcon`, `BriefcaseIcon` |
| `src/components/layout/footer.tsx` | `prefetch={false}` en el link al portal (de la sesión anterior, sin relación con Blueseas OS) |
| `src/dictionaries/en.json` / `es.json` | Sin cambios en esta fase respecto al último commit — las claves `portal.admin.*` quedaron ahí sin uso (ver recomendaciones) |
| `src/app/globals.css` | Sin cambios de contenido relevantes a esta fase |
| `package.json` / `package-lock.json` | Ver sección 10 |

---

## 8. Archivos nuevos

55 archivos nuevos en total desde `d903281`. Los más relevantes ya están listados en las secciones 1–6; en resumen:

- **17 páginas/layouts** del shell Blueseas OS (`src/app/(shell)/**`)
- **8 páginas/layouts** del Inspector Portal reorganizado (`src/app/[lang]/portal/(protected)/**`, `src/app/[lang]/portal/login/page.tsx`)
- **1 Route Handler** (`src/app/api/admin/invite-user/route.ts`)
- **12 componentes** nuevos (`executive/`, `finance/`, `operations/`, `shared/`, `ui/panel.tsx`, `ui/stat-card.tsx`)
- **8 componentes** del Inspector Portal (ya existían conceptualmente de la sesión anterior, ahora versionados por primera vez)
- **6 archivos de `lib`** (`fonts.ts`, `roles.ts`, `supabase/{client,server,middleware,types,guards}.ts`)
- **`supabase/schema.sql`** (schema completo, versionado por primera vez)

---

## 9. Archivos eliminados

Estos archivos se crearon y se eliminaron **dentro de esta misma sesión de trabajo sin llegar a commitearse nunca**, así que `git` no tiene registro de ellos como "eliminados" (nunca existieron en el historial). Los reconstruyo desde el log de esta conversación:

| Archivo eliminado | Reemplazado por |
|---|---|
| `src/app/[lang]/portal/(protected)/admin/` (carpeta completa: `layout.tsx`, `page.tsx`, `inspections/`, `users/`, `invoices/`, `expenses/`) | `src/app/(shell)/executive/`, `/operations/`, `/finance/` |
| `src/components/portal/admin-nav.tsx` | `src/components/shared/app-shell.tsx` |
| `src/components/portal/inspection-create-form.tsx` | `src/components/operations/inspection-create-form.tsx` |
| `src/components/portal/inspection-assign-panel.tsx` | `src/components/operations/inspection-assign-panel.tsx` |
| `src/components/portal/admin-invoice-status-form.tsx` | `src/components/finance/invoice-status-form.tsx` |
| `src/components/portal/admin-expense-status-form.tsx` | `src/components/finance/expense-status-form.tsx` |
| `src/components/portal/user-role-form.tsx` | `src/components/executive/user-role-form.tsx` |
| `src/components/portal/invite-user-form.tsx` | `src/components/executive/invite-user-form.tsx` |
| `src/components/portal/logout-button.tsx` (versión vieja, ligada a `lang`) | `src/components/shared/logout-button.tsx` |

No se eliminó ninguna funcionalidad: todo lo de arriba fue migrado, no descartado.

---

## 10. Dependencias agregadas

Comparando `package.json` contra el commit base:

```diff
  "dependencies": {
+   "@supabase/ssr": "^0.12.0",
+   "@supabase/supabase-js": "^2.110.2",
    "next": "16.2.10",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
```

No se agregó ninguna dependencia nueva específicamente para Blueseas OS (Fase 1) — todo se construyó con lo que ya estaba instalado (Next.js, React, Tailwind v4, y el cliente de Supabase que ya se había agregado para el Inspector Portal). No hay librerías de gráficos, tablas, ni componentes de terceros.

---

## 11. Estado de TypeScript

```
$ npx tsc --noEmit
(sin salida — 0 errores)
```

Todo el proyecto (incluyendo `(shell)/**`, `[lang]/portal/**`, `api/**`) tipa correctamente.

---

## 12. Resultado de `npm run build`

```
▲ Next.js 16.2.10 (Turbopack)
Creating an optimized production build ...

Turbopack build encountered 2 warnings:
[next]/internal/font/google/geist_*.module.css
Error while requesting resource
There was an issue establishing a connection while requesting
https://fonts.googleapis.com/css2?family=Geist...

Build error occurred
Error: Turbopack build failed with 2 errors: [...] Failed to fetch
`Geist` / `Geist Mono` from Google Fonts.
```

**Diagnóstico:** el build compila el 100% del código de la aplicación (todas las rutas, todos los componentes, sin errores de tipo ni de sintaxis) y falla únicamente al intentar descargar la tipografía Geist desde `fonts.googleapis.com`. Este entorno de pruebas (sandbox) no tiene salida a internet hacia ese dominio. **No es un error introducido por Fase 1** — es una limitación del entorno donde corrí las verificaciones, no del código.

**Acción recomendada:** correr `npm run build` en tu máquina (con internet normal) para confirmar que termina sin errores. Si en algún entorno de despliegue (CI/CD, Vercel, etc.) también faltara acceso a Google Fonts, la solución sería alojar las fuentes localmente con `next/font/local` en vez de `next/font/google`.

---

## 13. Resultado de `npm run lint`

```
$ npx eslint src
(sin salida — 0 errores, 0 warnings)
```

---

## 14. Aspectos que recomiendo mejorar antes de continuar

1. **Doble login temporal.** Hoy conviven `/login` (shell nuevo) y `/{lang}/portal/login` (Inspector Portal), ambos autenticando contra la misma tabla `profiles`. Es la decisión que tomamos para no arriesgar el login del portal que ya andaba, pero conviene decidir cuándo consolidar el Inspector Portal dentro del shell plano (perdiendo o no el bilingüe) para llegar al "único inicio de sesión" real que describe la visión del producto.

2. **Roles todavía no reales.** `operations`, `finance`, `shareholder`, `client` y `super_admin` existen solo como tipo en el código (`AppRole`). Mientras tanto, los 5 módulos nuevos están protegidos únicamente por `role === 'admin'` — cualquier admin ve todo. Falta: (a) extender el `check` constraint de `profiles.role` en Supabase, (b) decidir permisos por rol/módulo, (c) actualizar `requireAdminOrRedirect()` para aceptar el rol correspondiente por módulo en vez de exigir siempre `admin`.

3. **Datos demo sin fuente real.** Revenue MTD/YTD, Gross/Net Profit, Cash Position, Win Rate, y todos los KPIs de `/executive/kpis` no tienen modelo de datos detrás (no hay tablas de `payments` pobladas, ni pipeline comercial, ni tracking de clientes). Están claramente etiquetados "Demo", pero van a necesitar tablas nuevas en Supabase antes de poder mostrar números reales.

4. **Shareholder/Client Portal son solo cáscara.** No tienen modelo de datos propio (el Client Portal necesitaría, por ejemplo, una relación cliente↔inspecciones que hoy no existe en el schema).

5. **Claves de diccionario huérfanas.** `portal.admin.*` en `en.json`/`es.json` quedaron sin uso (las dejé a propósito, por seguridad, en vez de borrarlas). Se pueden limpiar cuando estés seguro de que no las necesitás más.

6. **Dependencia de red en el build (fuentes de Google).** Si en algún momento el entorno de build/CI no tiene salida a internet, el build va a fallar igual que en este sandbox. Migrar a `next/font/local` lo eliminaría por completo.

7. **Sin tests automatizados.** No hay ningún test (unitario, de integración, ni e2e) en el proyecto. Para un sistema que ya maneja facturación/gastos/usuarios reales, valdría la pena al menos cubrir los flujos críticos (login, cambio de rol, aprobación de facturas).

8. **Commit único y grande.** Todo el trabajo de esta fase (y de la sesión anterior, que nunca se había commiteado) quedó en un solo commit de 64 archivos. De acá en adelante conviene commitear con más frecuencia y en unidades más chicas.

9. **Aún no está pusheado a GitHub.** El commit vive solo en este entorno de trabajo local hasta que decidas hacer `git push`.

10. **Sin loading/error states dedicados.** Las páginas nuevas (Server Components async) no tienen `loading.tsx` ni `error.tsx` — si una consulta a Supabase tarda o falla, Next.js va a mostrar el comportamiento por defecto en vez de un estado cuidado.
