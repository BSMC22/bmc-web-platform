# Diagrams

Todos los diagramas Mermaid del modelo de dominio, consolidados en un solo lugar. Los diagramas por contexto son los mismos que aparecen junto a sus tablas de cardinalidad en [relationships.md](./relationships.md) — se repiten aquí para tener una vista única sin tener que saltar de archivo.

---

## Diagrama general simplificado (flujo completo del negocio)

```mermaid
flowchart LR
    Lead --> Opportunity
    Opportunity --> Quotation
    Quotation -->|accepted| Job
    Job --> JobAssignment[Inspector Assignment]
    JobAssignment --> Inspection
    Inspection --> InspectionReport[Report]
    InspectionReport -->|approved| Invoice
    Invoice --> Payment[Collection / Payment]
    Payment --> Closure[Job Closure]

    Client -.reusable business data.-> Job
    Vessel -.reusable business data.-> Job
    Port -.reusable business data.-> Inspection
    Inspector -.reusable business data.-> JobAssignment
    ServiceType -.reusable business data.-> Job

    style Job fill:#2563eb,color:#fff
    style Lead fill:#f3f4f6
    style Opportunity fill:#f3f4f6
    style Quotation fill:#f3f4f6
    style Invoice fill:#dcfce7
    style Payment fill:#dcfce7
```

---

## Identity & Access

```mermaid
erDiagram
    USER ||--o{ COMPANY_MEMBERSHIP : "tiene"
    COMPANY_MEMBERSHIP }o--|| COMPANY : "pertenece a"
    COMPANY_MEMBERSHIP ||--o{ USER_ROLE : "tiene"
    USER_ROLE }o--|| ROLE : "es"
    ROLE }o--o{ PERMISSION : "otorga"
```

## Organization

```mermaid
erDiagram
    COMPANY ||--|| COMPANY_SETTINGS : "configura"
    COMPANY ||--o{ CLIENT : "opera con"
    COMPANY ||--o{ JOB : "ejecuta"
    COMPANY ||--o{ INVOICE : "emite"
```

## Commercial

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

## Business Data

```mermaid
erDiagram
    CLIENT ||--o{ CLIENT_CONTACT : "tiene"
    CLIENT ||--o{ VESSEL : "opera (opcional)"
    INSPECTOR ||--o{ INSPECTOR_QUALIFICATION : "posee"
    INSPECTOR ||--o{ INSPECTOR_AVAILABILITY : "declara"
    PORT }o--|| COUNTRY : "está en"
    VESSEL }o--o| COUNTRY : "abandera en"
```

## Operations

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

## Finance

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

## Documents

```mermaid
erDiagram
    DOCUMENT ||--o{ DOCUMENT_VERSION : "versiona"
    DOCUMENT }o--|| DOCUMENT_CATEGORY : "es de tipo"
    DOCUMENT }o--o{ JOB : "adjunto a (polimórfico)"
    DOCUMENT }o--o{ INSPECTION : "adjunto a (polimórfico)"
```

## Communications & Governance

```mermaid
erDiagram
    NOTIFICATION }o--|| USER : "notifica a"
    COMMENT }o--o{ JOB : "comenta sobre (polimórfico)"
    ACTIVITY_LOG }o--o{ JOB : "registra evento de (polimórfico)"
    AUDIT_LOG }o--o{ INVOICE : "audita cambio de (polimórfico)"
```

---

## Job Lifecycle — las 3 dimensiones de estado

```mermaid
stateDiagram-v2
    direction LR
    state "operationalStatus" as OP {
        [*] --> draft
        draft --> confirmed
        confirmed --> scheduled
        scheduled --> in_progress
        in_progress --> completed
        scheduled --> on_hold
        in_progress --> on_hold
        on_hold --> scheduled
        draft --> cancelled
        confirmed --> cancelled
        scheduled --> cancelled
        in_progress --> cancelled
    }
```

```mermaid
stateDiagram-v2
    direction LR
    state "reportStatus" as RP {
        [*] --> not_started
        not_started --> in_progress
        in_progress --> submitted
        submitted --> under_review
        under_review --> approved
        under_review --> rejected
        rejected --> in_progress
    }
```

```mermaid
stateDiagram-v2
    direction LR
    state "billingStatus" as BS {
        [*] --> not_ready
        not_ready --> ready_to_invoice
        ready_to_invoice --> invoiced
        invoiced --> partially_paid
        partially_paid --> paid
        invoiced --> overdue
        partially_paid --> overdue
        invoiced --> voided
        partially_paid --> voided
        overdue --> voided
    }
```
