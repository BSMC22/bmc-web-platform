# Relationships

Cardinalidades entre entidades, agrupadas por bounded context, con un diagrama Mermaid por contexto. El diagrama general simplificado y la vista consolidada de todos los diagramas viven en [diagrams.md](./diagrams.md).

Notación de cardinalidad: `1—1`, `1—N`, `N—1`, `N—M`. Todas las relaciones son por ID (ver convención en [README.md](./README.md)) — ninguna entidad anida objetos completos de otra.

---

## Identity & Access

| De | A | Cardinalidad | Notas |
|---|---|---|---|
| User | CompanyMembership | 1—N | un User puede pertenecer a varias Company |
| CompanyMembership | Company | N—1 | |
| CompanyMembership | UserRole | 1—N | permite múltiples roles por membership |
| UserRole | Role | N—1 | |
| Role | Permission | N—M | vía matriz conceptual, no tabla propia en esta fase |

```mermaid
erDiagram
    USER ||--o{ COMPANY_MEMBERSHIP : "tiene"
    COMPANY_MEMBERSHIP }o--|| COMPANY : "pertenece a"
    COMPANY_MEMBERSHIP ||--o{ USER_ROLE : "tiene"
    USER_ROLE }o--|| ROLE : "es"
    ROLE }o--o{ PERMISSION : "otorga"
```

---

## Organization

| De | A | Cardinalidad | Notas |
|---|---|---|---|
| Company | CompanySettings | 1—1 | |
| Company | Client / Job / Quotation / Invoice / Expense / Document | 1—N | ver tabla multiempresa en domain-overview.md |

```mermaid
erDiagram
    COMPANY ||--|| COMPANY_SETTINGS : "configura"
    COMPANY ||--o{ CLIENT : "opera con"
    COMPANY ||--o{ JOB : "ejecuta"
    COMPANY ||--o{ INVOICE : "emite"
```

---

## Commercial

| De | A | Cardinalidad | Notas |
|---|---|---|---|
| Lead | Client | 0..1—1 | opcional, si ya existía el cliente |
| Lead | Opportunity | 0..1—1 | un Lead genera como máximo una Opportunity al convertirse |
| Opportunity | Client | N—1 | |
| Opportunity | Quotation | 1—N | puede tener varias cotizaciones/revisiones |
| Quotation | QuotationItem | 1—N | |
| Quotation | Job | 0..1—1 | una Quotation `accepted` puede generar como máximo un Job |
| Lead / Opportunity | CommercialActivity | 1—N | polimórfico |

```mermaid
erDiagram
    LEAD ||--o| OPPORTUNITY : "convierte en"
    LEAD }o--o| CLIENT : "puede referenciar"
    OPPORTUNITY }o--|| CLIENT : "pertenece a"
    OPPORTUNITY ||--o{ QUOTATION : "genera"
    QUOTATION ||--o{ QUOTATION_ITEM : "contiene"
    QUOTATION ||--o| JOB : "genera al aceptarse"
    LEAD ||--o{ COMMERCIAL_ACTIVITY : "registra"
    OPPORTUNITY ||--o{ COMMERCIAL_ACTIVITY : "registra"
```

---

## Business Data

| De | A | Cardinalidad | Notas |
|---|---|---|---|
| Client | ClientContact | 1—N | |
| Client | Vessel | 1—N | armador/operador habitual (opcional) |
| Inspector | InspectorQualification | 1—N | |
| Inspector | InspectorAvailability | 1—N | |
| Port | Country | N—1 | |
| Vessel | Country | N—1 | bandera, opcional |

```mermaid
erDiagram
    CLIENT ||--o{ CLIENT_CONTACT : "tiene"
    CLIENT ||--o{ VESSEL : "opera (opcional)"
    INSPECTOR ||--o{ INSPECTOR_QUALIFICATION : "posee"
    INSPECTOR ||--o{ INSPECTOR_AVAILABILITY : "declara"
    PORT }o--|| COUNTRY : "está en"
    VESSEL }o--o| COUNTRY : "abandera en"
```

---

## Operations

| De | A | Cardinalidad | Notas |
|---|---|---|---|
| Job | Client | N—1 | |
| Job | ServiceType | N—1 | tipo principal |
| Job | JobAssignment | 1—N | equipo asignado al Job completo |
| Job | Inspection | 1—N | ver decisión Job vs Inspection en domain-overview.md |
| Job | Invoice | 1—N | normalmente 1, excepcionalmente varias |
| Job | Expense | 1—N | |
| Job | JobMilestone | 1—N | |
| Job | JobStatusHistory | 1—N | |
| Job | OperationalNote | 1—N | |
| JobAssignment | Inspector | N—1 | |
| Inspection | InspectionReport | 1—N | normalmente 1, puede tener varias versiones/revisiones |
| Inspection | Vessel / Port | N—1 (c/u, opcional) | por defecto hereda del Job |

```mermaid
erDiagram
    JOB }o--|| CLIENT : "es para"
    JOB }o--|| SERVICE_TYPE : "es de tipo"
    JOB ||--o{ JOB_ASSIGNMENT : "asigna equipo"
    JOB_ASSIGNMENT }o--|| INSPECTOR : "asigna a"
    JOB ||--o{ INSPECTION : "ejecuta"
    INSPECTION ||--o{ INSPECTION_REPORT : "produce"
    JOB ||--o{ INVOICE : "factura"
    JOB ||--o{ EXPENSE : "genera costo"
    JOB ||--o{ JOB_STATUS_HISTORY : "registra cambios"
```

---

## Finance

| De | A | Cardinalidad | Notas |
|---|---|---|---|
| Invoice | Client | N—1 | |
| Invoice | Job | 0..1—1 | normalmente presente, ver excepción documentada en entity-catalog.md |
| Invoice | InvoiceItem | 1—N | |
| Invoice | Payment | 1—N | pagos parciales |
| Invoice | CollectionActivity | 1—N | |
| Expense | Job | N—1 | |
| Expense | Inspector | N—1 | |

```mermaid
erDiagram
    INVOICE }o--|| CLIENT : "factura a"
    INVOICE }o--o| JOB : "corresponde a"
    INVOICE ||--o{ INVOICE_ITEM : "contiene"
    INVOICE ||--o{ PAYMENT : "recibe"
    INVOICE ||--o{ COLLECTION_ACTIVITY : "gestiona cobro"
    EXPENSE }o--|| JOB : "pertenece a"
    EXPENSE }o--|| INSPECTOR : "incurrido por"
```

---

## Documents

| De | A | Cardinalidad | Notas |
|---|---|---|---|
| Document | DocumentVersion | 1—N | |
| Document | DocumentCategory | N—1 | |
| Document | (Job \| Inspection \| Inspector \| Client \| InspectorQualification \| ...) | N—M | polimórfico, vía `DocumentLink` conceptual |

```mermaid
erDiagram
    DOCUMENT ||--o{ DOCUMENT_VERSION : "versiona"
    DOCUMENT }o--|| DOCUMENT_CATEGORY : "es de tipo"
    DOCUMENT }o--o{ JOB : "adjunto a (polimórfico)"
    DOCUMENT }o--o{ INSPECTION : "adjunto a (polimórfico)"
```

---

## Communications & Governance

| De | A | Cardinalidad | Notas |
|---|---|---|---|
| Notification | User | N—1 | |
| Comment | (cualquier entidad) | N—1 | polimórfico |
| ActivityLog | (cualquier entidad) | N—1 | polimórfico |
| AuditLog | (cualquier entidad) | N—1 | polimórfico |

```mermaid
erDiagram
    NOTIFICATION }o--|| USER : "notifica a"
    COMMENT }o--o{ JOB : "comenta sobre (polimórfico)"
    ACTIVITY_LOG }o--o{ JOB : "registra evento de (polimórfico)"
    AUDIT_LOG }o--o{ INVOICE : "audita cambio de (polimórfico)"
```
