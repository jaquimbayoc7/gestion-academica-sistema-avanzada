# 📊 Insights del Proyecto — Sistema de Gestión Académica Avanzada

> **Corte:** Segundo Corte — Programación Avanzada 2026A
> **Fecha de análisis:** 8 de Abril de 2026
> **Repositorio:** [jaquimbayoc7/gestion-academica-sistema-avanzada](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada)

---

## 1. Estado General del Proyecto

| Indicador | Valor |
|-----------|-------|
| **Sprints completados** | 3 de 5 |
| **Historias de usuario cerradas** | 10 de 13 |
| **Historias en progreso** | 1 (HU-10 Frontend avanzado) |
| **Cobertura de smoke tests** | 9 suites · 47 casos de prueba |
| **Commits totales** | 6 |
| **Último commit** | `bbe74cf` — 8 Abr 2026 |
| **Archivos fuente** | 36 backend · 21 frontend · 10 smoke tests |

---

## 2. Progreso por Sprint

### Sprint 1 — Infraestructura y Entidades Base `✅ DONE`
> **Mar 16 – Mar 29, 2026** · Milestone cerrado

| Issue | Historia | Cierre |
|-------|----------|--------|
| #2 | INFRA — Setup inicial: Docker, Prisma y estructura | 8 Abr 2026 |
| #3 | HU-01 — Gestión de Estudiantes | 8 Abr 2026 |
| #4 | HU-02 — Gestión de Docentes | 8 Abr 2026 |
| #5 | HU-03 — Gestión de Programas Académicos | 8 Abr 2026 |

**Entregables:**
- Docker Compose con `db + backend + frontend` con hot-reload
- Schema Prisma con 8 modelos y migración inicial (`20260324161006_init`)
- CRUD completo: Estudiante, Docente, ProgramaAcadémico
- ResponseInterceptor + HttpExceptionFilter globales
- Frontend base: páginas `/estudiantes`, `/docentes`, `/programas`

---

### Sprint 2 — Asignaturas, Períodos y Módulos Transversales `✅ DONE`
> **Mar 30 – Abr 10, 2026** · Milestone cerrado

| Issue | Historia | Cierre |
|-------|----------|--------|
| #6 | HU-04 — Gestión de Asignaturas | 8 Abr 2026 |
| #7 | HU-05 — Gestión de Períodos Académicos | 8 Abr 2026 |
| #8 | HU-06 — Asignación de Docente a Asignatura | 8 Abr 2026 |
| #9 | HU-09 — Common Module: Filtros, Interceptores y Pipes | 8 Abr 2026 |

**Entregables:**
- CRUD: Asignatura (con FK a Programa), PeriodoAcadémico, AsignaciónDocente
- Regla de negocio: solo un período activo simultáneamente
- Regla de unicidad: misma combinación docente+asignatura+período = 409
- ValidationPipe global con `whitelist: true`
- Frontend: páginas `/asignaturas`, `/periodos`, `/asignaciones`

---

### Sprint 3 — Matrícula, Calificaciones y Frontend Base `✅ DONE`
> **Abr 13 – Abr 17, 2026** · Cerrado anticipadamente el 8 Abr

| Issue | Historia | Cierre |
|-------|----------|--------|
| #10 | HU-07 — Matrícula de Estudiante en Asignatura | 8 Abr 2026 |
| #11 | HU-08 — Registro de Calificaciones | 8 Abr 2026 |

**Entregables:**
- Módulo Matrícula: FK a Estudiante + AsignaciónDocente, control de cancelación
- Módulo Calificaciones: fórmula `nota1×0.30 + nota2×0.30 + nota3×0.40` calculada en servicio
- Restricción: matrícula no cancelable si tiene calificación registrada
- Frontend: páginas `/matriculas`, `/calificaciones`
- Suite de smoke tests completa (9 archivos, 47 casos)

---

### Sprint 4 — Frontend Avanzado `🔄 IN PROGRESS`
> **Abr 20 – May 8, 2026**

| Issue | Historia | Estado |
|-------|----------|--------|
| #12 | HU-10 — Frontend: Listados, Formularios y Navegación | In Progress |

**Pendiente:**
- Selects dinámicos con relaciones entre entidades
- Páginas de detalle con data completa
- Estados de carga (`loading`, `error`, `empty`)
- Navegación entre entidades relacionadas

---

### Sprint 5 — Cierre y Despliegue `📋 TODO`
> **May 11 – May 22, 2026**

| Issue | Historia | Estado |
|-------|----------|--------|
| #13 | HU-11 — Integración Final y Despliegue con Docker | Todo |

---

## 3. Stack Tecnológico

### Backend
| Componente | Versión |
|-----------|---------|
| NestJS | ^10.0.0 |
| Prisma Client | ^7.5.0 |
| Prisma Adapter PG | ^7.5.0 |
| class-validator | — |
| Node.js | 22 (Alpine 3.21) |
| PostgreSQL | 16 (Alpine) |

### Frontend
| Componente | Versión |
|-----------|---------|
| Next.js | 16.2.1 |
| React | 19.2.4 |
| Tailwind CSS | ^4 |
| TypeScript | ^5 |

---

## 4. Arquitectura de la API

### Prefijo global: `/api/v1`

Todos los endpoints siguen el formato de respuesta estandarizado:

```json
{
  "statusCode": 200,
  "message": "OK",
  "data": { ... }
}
```

Errores:
```json
{
  "statusCode": 409,
  "message": "El código ya está registrado",
  "error": "Conflict"
}
```

### Endpoints disponibles

| Módulo | Ruta Base | Notas |
|--------|-----------|-------|
| Programas Académicos | `/programa-academico` | Código único |
| Estudiantes | `/estudiante` | Correo y documento únicos |
| Docentes | `/docente` | Documento único |
| Asignaturas | `/asignatura` | FK a Programa |
| Períodos Académicos | `/periodo-academico` | Solo 1 activo |
| Asignaciones Docente | `/asignacion-docente` | Clave compuesta única |
| Matrículas | `/matricula` | Cancelable solo sin calificación |
| Calificaciones | `/calificacion` | Nota definitiva calculada automáticamente |

---

## 5. Modelo de Datos

```
ProgramaAcademico ────< Estudiante
        │
        └────< Asignatura ────< AsignacionDocente >──── Docente
                                        │                    
                              PeriodoAcademico ────< AsignacionDocente
                                        │
                              AsignacionDocente ────< Matricula >──── Estudiante
                                                            │
                                                     Calificacion
```

**Modelos Prisma (8 entidades):**
1. `ProgramaAcademico` — código único
2. `Estudiante` — `codigoEstudiantil`, `documentoIdentidad`, `correoInstitucional` únicos
3. `Docente` — `documentoIdentidad`, `correoInstitucional` únicos
4. `Asignatura` — FK obligatoria a `ProgramaAcademico`
5. `PeriodoAcademico` — campo `activo` con constraint de unicidad parcial
6. `AsignacionDocente` — clave compuesta `(docenteId, asignaturaId, periodoAcademicoId)`
7. `Matricula` — clave compuesta `(estudianteId, asignacionDocenteId)`, estado `ACTIVA/CANCELADA`
8. `Calificacion` — `matriculaId` único, fórmula de nota definitiva

---

## 6. Smoke Tests

Ubicación: `smoke-tests/` · Ejecutor: `node --test` (sin dependencias externas)

### Cómo ejecutar

```bash
# Requisito: backend corriendo en http://localhost:3001
cd smoke-tests
npm test
# o con PowerShell:
./run-all.ps1
```

### Cobertura por suite

| Archivo | Historia | Casos | Qué valida |
|---------|----------|-------|------------|
| `01-health.test.js` | HU-09 | 1 | Formato `{ statusCode, message, data }` |
| `02-programas.test.js` | HU-03 | 5 | CRUD + 409 código duplicado |
| `03-estudiantes.test.js` | HU-01 | 6 | CRUD + 409 correo duplicado |
| `04-docentes.test.js` | HU-02 | 6 | CRUD + 409 documento duplicado |
| `05-asignaturas.test.js` | HU-04 | 6 | CRUD + 404 FK inválida |
| `06-periodos.test.js` | HU-05 | 5 | CRUD + solo 1 período activo |
| `07-asignaciones.test.js` | HU-06 | 5 | Create + 409 compound key |
| `08-matriculas.test.js` | HU-07 | 7 | Create + 409 + cancelación permitida |
| `09-calificaciones.test.js` | HU-08 | 6 | Fórmula ponderada + 409 + 400 al cancelar matrícula |
| **Total** | **9 HU** | **47** | |

### Reglas de negocio validadas por tests

```
✅ nota_definitiva = nota1 * 0.30 + nota2 * 0.30 + nota3 * 0.40
✅ Solo un PeriodoAcademico puede tener activo = true
✅ Matrícula no se puede cancelar si tiene Calificacion registrada
✅ AsignacionDocente: (docenteId + asignaturaId + periodoId) es único
✅ Matrícula: (estudianteId + asignacionId) es único
✅ Correo institucional del Estudiante y Docente es único
```

---

## 7. Historial de Commits

| Hash | Fecha | Tipo | Descripción |
|------|-------|------|-------------|
| `ea5d220` | 18 Mar 2026 | docs | README inicial del proyecto |
| `6d11a99` | 24 Mar 2026 | feat | INFRA — Setup Docker, Prisma, NestJS, Next.js |
| `1359396` | 24 Mar 2026 | fix | Dependencias frontend, tsconfig backend, global.d.ts |
| `20ff592` | 24 Mar 2026 | fix | Pipeline build backend, PrismaService para Prisma 7 |
| `348ca98` | 24 Mar 2026 | fix | Errores de linting y configuración TypeScript |
| `bbe74cf` | 8 Abr 2026 | feat | **Sprint 1-3 completo + smoke tests** — 61 archivos, 3621 inserciones |

**Ciclo de desarrollo:**
- `Mar 18 – Mar 24` → Setup de infraestructura (5 commits en un día)
- `Mar 24 – Abr 8` → Período de implementación intensiva (15 días)
- `Abr 8` → Entrega Sprint 1-3: todos los módulos backend + frontend + smoke tests

---

## 8. Análisis del Commit Principal (`bbe74cf`)

El commit `feat: Sprint 1-3 completo + smoke tests` fue el más grande del proyecto:

```
61 archivos modificados
3.621 líneas añadidas
  214 líneas eliminadas

Módulos implementados en este commit:
  - asignacion-docente: controller, service, DTOs
  - asignatura:         controller, service, DTOs
  - calificacion:       controller, service, DTOs
  - docente:            controller, service, DTOs
  - estudiante:         controller, service, DTOs
  - matricula:          controller, service, DTOs
  - periodo-academico:  controller, service, DTOs
  - programa-academico: controller, service, DTOs
  - smoke-tests:        9 test files + helpers + runner
```

---

## 9. Kanban Board — Estado Actual

> [Ver tablero](https://github.com/users/jaquimbayoc7/projects/3)

```
┌─────────────────────────────┬──────────────────────────────┬──────────────────────────────────────┐
│           TODO              │         IN PROGRESS          │              DONE                    │
├─────────────────────────────┼──────────────────────────────┼──────────────────────────────────────┤
│ HU-11 Integración Docker    │ HU-10 Frontend avanzado      │ INFRA   Setup inicial                │
│ 📋 DoD — Referencia Global  │                              │ HU-01   Gestión Estudiantes          │
│                             │                              │ HU-02   Gestión Docentes             │
│                             │                              │ HU-03   Gestión Programas            │
│                             │                              │ HU-04   Gestión Asignaturas          │
│                             │                              │ HU-05   Períodos Académicos          │
│                             │                              │ HU-06   Asignación Docente           │
│                             │                              │ HU-07   Matrícula                    │
│                             │                              │ HU-08   Calificaciones               │
│                             │                              │ HU-09   Common Module                │
└─────────────────────────────┴──────────────────────────────┴──────────────────────────────────────┘
```

---

## 10. Velocidad por Sprint

| Sprint | Issues | Módulos backend | Páginas frontend | Tests | Estado |
|--------|--------|-----------------|------------------|-------|--------|
| Sprint 1 | 4 | 3 (Estudiante, Docente, Programa) | 3 | 18 | ✅ Done |
| Sprint 2 | 4 | 4 (Asignatura, Período, Asignación, Common) | 3 | 16 | ✅ Done |
| Sprint 3 | 2 | 2 (Matrícula, Calificación) + smoke infra | 2 | 13 | ✅ Done |
| Sprint 4 | 1 | — | TBD (selects dinámicos, detalle) | — | 🔄 In Progress |
| Sprint 5 | 1 | — | — | — | 📋 Todo |

---

## 11. Próximos Pasos (Sprint 4 — HU-10)

- [ ] Selects dinámicos: formulario de Asignatura debe cargar Programas desde API
- [ ] Formulario de Asignación: selects de Docente, Asignatura y Período
- [ ] Formulario de Matrícula: select cruzado Estudiante × Asignación
- [ ] Páginas de detalle con relaciones populadas (`/estudiantes/[id]`)
- [ ] Estados de UI: skeleton loaders, mensajes de error, empty states
- [ ] Validación en cliente antes de enviar formularios

---

*Generado el 8 de Abril de 2026 · Ing. Julian Quimbayo*
