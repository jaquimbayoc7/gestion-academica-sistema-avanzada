# 🎓 Sistema de Gestión Académica

<p align="center">
  <strong>Proyecto full-stack guiado por el docente · Programación Avanzada 2026A</strong><br>
  <em>Corporación Universitaria del Huila — CORHUILA · Ingeniería de Sistemas</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Prisma-7.5-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

<p align="center">
  <a href="https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues?q=is%3Aissue+is%3Aclosed">
    <img src="https://img.shields.io/github/issues-closed/jaquimbayoc7/gestion-academica-sistema-avanzada?style=flat-square&label=Issues%20cerrados" alt="Issues cerrados"/>
  </a>
  <img src="https://img.shields.io/badge/Estado-Release%202%20✅-brightgreen?style=flat-square" alt="Estado"/>
  <img src="https://img.shields.io/badge/Sprints-5%20de%205%20completos-blue?style=flat-square" alt="Sprints"/>
</p>

---

> **Estado al 29 de Abril 2026:** Release 2 entregado ✅ — Sprints 1-5 completos

---

## 📋 Tabla de Contenidos

- [🚀 Inicio Rápido (para estudiantes)](#-inicio-rápido-para-estudiantes)
- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Plan de Releases](#-plan-de-releases)
- [Sprints e Historias de Usuario](#-sprints-e-historias-de-usuario)
- [Cronograma](#-cronograma)
- [Definition of Done (DoD)](#-definition-of-done-dod)
- [Smoke Tests](#-smoke-tests)
- [Tablero Kanban](#-tablero-kanban)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Solución de Problemas](#-solución-de-problemas)

---

## � Inicio Rápido (para estudiantes)

> Sigue estos pasos **en orden**. Si tienes Docker instalado, el proyecto levanta completo con un solo comando.

### Prerrequisitos mínimos

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| **Git** | cualquiera | [git-scm.com](https://git-scm.com/downloads) |
| **Docker Desktop** | 4.x | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) |
| **Node.js** | 22 LTS | [nodejs.org](https://nodejs.org/) *(solo para desarrollo local o smoke tests)* |

> ⚠️ Asegúrate de que **Docker Desktop esté corriendo** antes de continuar.

---

### Opción A — Con Docker (recomendada, sin instalar nada más)

```bash
# 1. Clonar el repositorio
git clone https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada.git
cd gestion-academica-sistema-avanzada

# 2. Crear el archivo de variables de entorno
cp .env.example .env          # Linux / macOS
copy .env.example .env        # Windows (CMD / PowerShell)

# 3. Levantar todo (base de datos + backend + frontend)
docker compose up --build

# ✅ Listo — espera a ver el mensaje "Ready on http://localhost:3000"
```

| Servicio | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **API REST** | http://localhost:3001/api/v1 |
| **Health check** | http://localhost:3001/api/v1/health |

> La primera vez puede tardar 3-5 minutos mientras Docker descarga las imágenes y construye los contenedores. Las siguientes veces es mucho más rápido.

```bash
# Para detener todo:
docker compose down

# Para detener y eliminar los datos de la base de datos:
docker compose down -v
```

---

### Opción B — Desarrollo local (hot-reload)

Ideal cuando estás modificando el código y quieres ver los cambios al instante.

```bash
# 1. Clonar y configurar .env (igual que arriba)
git clone https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada.git
cd gestion-academica-sistema-avanzada
copy .env.example .env    # Windows

# 2. Solo la base de datos en Docker
docker compose up db

# 3. Instalar dependencias y migrar (desde la carpeta backend/)
cd backend
npm install
npx prisma migrate dev    # aplica las migraciones en la BD local
npx prisma generate       # genera el cliente Prisma
npm run start:dev         # → http://localhost:3001  (hot-reload)

# 4. En otra terminal, instalar y correr el frontend (desde frontend/)
cd ../frontend
npm install
npm run dev               # → http://localhost:3000  (hot-reload)
```

---

### Verificar que todo funciona

```bash
# Desde la carpeta smoke-tests/ (requiere backend corriendo)
cd smoke-tests
npm install
npm test
# Deberías ver: ✅ 47 tests pasando
```

---

## �📖 Descripción del Proyecto

El **Sistema de Gestión Académica** es una aplicación web full-stack que permite administrar el proceso académico de una institución educativa: registro de estudiantes, docentes, programas, asignaturas, períodos académicos, matrículas y calificaciones.

### Alcance

| Aspecto | Detalle |
|---|---|
| **Tipo** | Proyecto demostrativo — Guiado por el Docente |
| **Entidades** | 8 entidades con relaciones (ver modelo de datos) |
| **Historias de Usuario** | 11 HUs organizadas en 5 sprints |
| **Releases** | 2 releases alineados con los cortes académicos |
| **Casos de Uso** | 5 CUs (CRUD, matrícula, calificaciones) |
| **Smoke Tests** | 9 suites / 47 casos automatizados |

### Funcionalidades implementadas (Release 1 — 8 Abr 2026)

- ✅ CRUD completo de Estudiantes, Docentes, Programas Académicos y Asignaturas
- ✅ Gestión de Períodos Académicos con control de estado activo único
- ✅ Asignación de Docentes a Asignaturas por período (unicidad compuesta)
- ✅ Matrícula de Estudiantes con control de cancelación
- ✅ Registro y cálculo automático de Calificaciones (`nota1×0.30 + nota2×0.30 + nota3×0.40`)
- ✅ Common Module: ResponseInterceptor, HttpExceptionFilter, ValidationPipe globales
- ✅ 8 páginas frontend con listados y formularios CRUD
- ✅ Suite de smoke tests automatizados (Node.js built-in test runner)

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| **Backend** | NestJS (Node.js + TypeScript) | ^10.0.0 | API REST con arquitectura en capas |
| **Frontend** | Next.js (React + TypeScript) | 16.2.1 | Interfaz de usuario con App Router |
| **Base de Datos** | PostgreSQL | 16-alpine | Almacenamiento relacional |
| **ORM** | Prisma | ^7.5.0 | Modelado de datos, migraciones y queries |
| **ORM Adapter** | @prisma/adapter-pg | ^7.5.0 | Driver PG para Prisma 7 |
| **Contenedores** | Docker + Docker Compose | — | Orquestación de servicios |
| **Validación** | class-validator + class-transformer | — | DTOs y validación de entrada |
| **Estilos** | Tailwind CSS | ^4 | Utilidades CSS en el frontend |
| **Tests** | Node.js built-in `node:test` | — | Smoke tests sin dependencias externas |

---

## 🏗 Arquitectura

El proyecto sigue una **arquitectura en capas** con separación de responsabilidades:

```
Cliente HTTP → Controller (valida DTO + ruta) → Service (lógica de negocio) → Repository (acceso a datos) → Prisma / PostgreSQL
```

### Estructura del Proyecto

```
proyecto/
├── docker-compose.yml              # Orquestación: db + backend + frontend
├── .env.example                    # Variables de entorno documentadas
├── smoke-tests/                    # Pruebas smoke automatizadas
│   ├── package.json
│   ├── run-all.ps1
│   └── tests/
│       ├── helpers.js              # Helpers: get/post/put/del + asserts
│       ├── 01-health.test.js       # HU-09: formato de respuesta
│       ├── 02-programas.test.js    # HU-03: CRUD Programas
│       ├── 03-estudiantes.test.js  # HU-01: CRUD Estudiantes
│       ├── 04-docentes.test.js     # HU-02: CRUD Docentes
│       ├── 05-asignaturas.test.js  # HU-04: CRUD Asignaturas
│       ├── 06-periodos.test.js     # HU-05: Períodos activos
│       ├── 07-asignaciones.test.js # HU-06: Asignaciones docente
│       ├── 08-matriculas.test.js   # HU-07: Matrículas
│       └── 09-calificaciones.test.js # HU-08: Calificaciones + fórmula
├── backend/                        # API REST con NestJS
│   ├── Dockerfile
│   ├── prisma.config.ts            # Configuración Prisma 7 CLI
│   ├── src/
│   │   ├── main.ts                 # Bootstrap + interceptor/filter globales
│   │   ├── common/
│   │   │   ├── filters/            # HttpExceptionFilter global
│   │   │   └── interceptors/       # ResponseInterceptor global
│   │   ├── prisma/                 # PrismaService con adapter PG
│   │   ├── programa-academico/
│   │   ├── estudiante/
│   │   ├── docente/
│   │   ├── asignatura/
│   │   ├── periodo-academico/
│   │   ├── asignacion-docente/
│   │   ├── matricula/
│   │   └── calificacion/
│   └── prisma/
│       ├── schema.prisma           # 8 modelos Prisma
│       └── migrations/
├── frontend/                       # Interfaz con Next.js
│   ├── Dockerfile
│   └── src/
│       ├── app/                    # App Router: 8 páginas CRUD + dashboard
│       ├── services/               # Capa de acceso a la API (8 servicios)
│       ├── types/                  # Tipos TypeScript por entidad
│       └── lib/
│           └── api.ts              # Cliente HTTP base
└── INSIGHTS.md                     # Análisis de sprints y métricas del proyecto
```

---

## 📊 Modelo de Datos

### Diagrama de Relaciones

```
Estudiante          1 ──── N  Matricula
Docente             1 ──── N  AsignacionDocente
ProgramaAcademico   1 ──── N  Estudiante
ProgramaAcademico   1 ──── N  Asignatura
Asignatura          1 ──── N  AsignacionDocente
PeriodoAcademico    1 ──── N  AsignacionDocente
AsignacionDocente   1 ──── N  Matricula
Matricula           1 ──── 1  Calificacion
```

### Entidades

| Entidad | Campos Principales |
|---|---|
| **Estudiante** | id, nombres, apellidos, codigoEstudiantil (unique), documentoIdentidad (unique), correoInstitucional (unique), fechaNacimiento, programaAcademicoId |
| **Docente** | id, nombres, apellidos, documentoIdentidad (unique), tituloProfesional, especialidad, correoInstitucional (unique), telefono |
| **ProgramaAcademico** | id, nombre, codigo (unique), facultad, duracionSemestres |
| **Asignatura** | id, nombre, codigo (unique), creditos, programaAcademicoId |
| **PeriodoAcademico** | id, nombre (unique), fechaInicio, fechaFin, activo |
| **AsignacionDocente** | id, docenteId, asignaturaId, periodoAcademicoId (unique compound) |
| **Matricula** | id, estudianteId, asignacionDocenteId, fechaInscripcion (unique compound) |
| **Calificacion** | id, matriculaId (unique), nota1, nota2, nota3, notaDefinitiva |

---

## 🚀 Plan de Releases

### Release 1 — Segundo Corte: Backend + Frontend Base

> **📅 Cierre: 17 de Abril de 2026** · Sprints 1, 2 y 3

**Objetivo:** Entregar la API REST completa con arquitectura en capas (Controller → Service → Repository) y el frontend con las vistas de CRUD para todas las entidades base.

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| [Sprint 1](#sprint-1--infraestructura-y-entidades-base) | Mar 16 → Mar 29 | HU-01, HU-02, HU-03 | Docker, Prisma, Estudiante, Docente, Programa |
| [Sprint 2](#sprint-2--entidades-académicas-y-cross-cutting) | Mar 30 → Abr 10 | HU-04, HU-05, HU-06 | Asignatura, Período, Asignación, Common Module |
| [Sprint 3](#sprint-3--matrícula-calificaciones-y-frontend-base) | Abr 13 → Abr 17 | HU-07, HU-08, HU-09 | Matrícula, Calificación, Frontend base |

### Release 2 — Tercer Corte: Integración y Despliegue

> **📅 Cierre: 22 de Mayo de 2026** · Sprints 4 y 5

**Objetivo:** Integración completa frontend ↔ backend, formularios avanzados con relaciones, registro de calificaciones desde la interfaz y despliegue funcional con Docker.

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| [Sprint 4](#sprint-4--frontend-avanzado-e-integración) | Abr 20 → May 8 | HU-10 | Frontend listados, formularios, navegación y layout |
| [Sprint 5](#sprint-5--cierre-y-despliegue) | May 11 → May 22 | HU-11 | Integración de flujos, pruebas, Docker Compose, README |

---

## 📌 Sprints e Historias de Usuario

### Sprint 1 — Infraestructura y entidades base `✅ DONE`

> 📅 **Mar 16 → Mar 29** · 🚫 Festivo: Mar 23 (San José) · [Milestone Sprint 1](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/milestone/1)

| # | Historia de Usuario | Issue | Estado |
|---|---|---|---|
| HU-01 | Gestión de Estudiantes | [#3](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/3) | ✅ Cerrado 8 Abr |
| HU-02 | Gestión de Docentes | [#4](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/4) | ✅ Cerrado 8 Abr |
| HU-03 | Gestión de Programas Académicos | [#5](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/5) | ✅ Cerrado 8 Abr |
| INFRA | Setup inicial: Docker, Prisma, NestJS, Next.js | [#2](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/2) | ✅ Cerrado 8 Abr |

**Entregables verificados:**
- ✅ Docker Compose con PostgreSQL, NestJS y Next.js (hot-reload)
- ✅ Prisma 7 configurado con `prisma.config.ts` + migración inicial
- ✅ CRUD completo (Controller → Service) para Estudiante, Docente y ProgramaAcadémico
- ✅ ResponseInterceptor + HttpExceptionFilter + ValidationPipe globales
- ✅ Frontend: páginas `/estudiantes`, `/docentes`, `/programas`
- ✅ Smoke tests: `03-estudiantes.test.js`, `04-docentes.test.js`, `02-programas.test.js`

---

### Sprint 2 — Entidades académicas y cross-cutting `✅ DONE`

> 📅 **Mar 30 → Abr 10** · 🚫 Festivos: Abr 2-3 (Semana Santa) · [Milestone Sprint 2](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/milestone/2)

| # | Historia de Usuario | Issue | Estado |
|---|---|---|---|
| HU-04 | Gestión de Asignaturas | [#6](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/6) | ✅ Cerrado 8 Abr |
| HU-05 | Gestión de Períodos Académicos | [#7](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/7) | ✅ Cerrado 8 Abr |
| HU-06 | Asignación Docente-Asignatura | [#8](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/8) | ✅ Cerrado 8 Abr |
| HU-09 | Common Module: Filters, Interceptors, Pipes | [#9](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/9) | ✅ Cerrado 8 Abr |

**Entregables verificados:**
- ✅ CRUD de Asignatura con FK obligatoria a ProgramaAcadémico
- ✅ CRUD de PeriodoAcadémico: solo 1 activo a la vez (desactiva los demás al activar)
- ✅ CRUD de AsignacionDocente: unicidad compuesta `(docenteId + asignaturaId + periodoId)`
- ✅ 409 Conflict en duplicados, 404 en FK inválidas
- ✅ Frontend: páginas `/asignaturas`, `/periodos`, `/asignaciones`
- ✅ Smoke tests: `05-asignaturas.test.js`, `06-periodos.test.js`, `07-asignaciones.test.js`

---

### Sprint 3 — Matrícula, Calificaciones y Frontend base `✅ DONE`

> 📅 **Abr 13 → Abr 17** · 📝 Cierre Segundo Corte: 17 Abr · [Milestone Sprint 3](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/milestone/3)
> ⚡ Entregado anticipadamente el **8 de Abril de 2026**

| # | Historia de Usuario | Issue | Estado |
|---|---|---|---|
| HU-07 | Matrícula de Estudiantes | [#10](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/10) | ✅ Cerrado 8 Abr |
| HU-08 | Registro de Calificaciones | [#11](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/11) | ✅ Cerrado 8 Abr |

**Entregables verificados:**
- ✅ Matrícula: FK a Estudiante + AsignaciónDocente, estado `ACTIVA/CANCELADA`
- ✅ Matrícula no cancelable si tiene calificación registrada (400 Bad Request)
- ✅ Calificación única por matrícula; nota definitiva = `nota1×0.30 + nota2×0.30 + nota3×0.40`
- ✅ Frontend: páginas `/matriculas`, `/calificaciones`
- ✅ Smoke tests: `08-matriculas.test.js`, `09-calificaciones.test.js` (valida fórmula ponderada)

---

### Sprint 4 — Frontend avanzado e integración `✅ DONE`

> 📅 **Abr 20 → May 8** · 🚫 Festivo: May 1 (Día del Trabajo) · [Milestone Sprint 4](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/milestone/4)

| # | Historia de Usuario | Issue | Estado |
|---|---|---|---|
| HU-10 | Frontend: Listados, Formularios y Navegación | [#12](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/12) | ✅ Cerrado 27 Abr |

**Entregables verificados:**
- ✅ Páginas de detalle con relaciones populadas: `/estudiantes/[id]`, `/docentes/[id]`
- ✅ Skeleton loaders en todas las tablas (reemplazo de "Cargando...")
- ✅ Empty states con acceso directo a crear entidad
- ✅ Navegación entre entidades relacionadas (ver detalle desde listado)
- ✅ Validación en cliente: notas 0-5, campos requeridos con `required`, selects dinámicos con `disabled` por defecto
- ✅ Resumen estadístico en páginas de detalle (aprobadas/reprobadas, períodos dictados)

---

### Sprint 5 — Cierre y despliegue `✅ DONE`

> 📅 **May 11 → May 22** · 🚫 Festivo: May 18 (Día de la Ascensión) · 📝 Cierre Tercer Corte: May 22 · [Milestone Sprint 5](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/milestone/5)

| # | Historia de Usuario | Issue | Estado |
|---|---|---|---|
| HU-11 | Integración Final y Despliegue con Docker | [#13](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/13) | ✅ Cerrado 27 Abr |

**Entregables verificados:**
- ✅ `docker compose up --build` arranca toda la aplicación sin pasos manuales
- ✅ `entrypoint.sh` ejecuta `prisma migrate deploy` automáticamente al iniciar el backend
- ✅ Healthcheck en backend: `GET /api/v1/health` devuelve `{ status: 'ok', timestamp }`
- ✅ Frontend espera a que el backend esté saludable (`condition: service_healthy`)
- ✅ Flujo completo integrado: Programa → Estudiante → Docente → Asignatura → Período → Asignación → Matrícula → Calificación
- ✅ README actualizado con instrucción de arranque en un solo comando

---

## 📅 Cronograma

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    SEGUNDO CORTE (Release 1) — Cierre: 17 Abr 2026          │
│                          Backend + Frontend Base                            │
├─────────────────────┬─────────────────────┬──────────────────────────────────┤
│  Sprint 1           │    Sprint 2         │         Sprint 3                │
│  Mar 16 → Mar 29    │  Mar 30 → Abr 10    │   Abr 13 → Abr 17             │
│                     │                     │                                 │
│ • Docker + Prisma   │ • Asignatura        │ • Matrícula                     │
│ • Estudiante        │ • Período           │ • Calificación                  │
│ • Docente           │ • Asignación Doc    │ • Common Module                 │
│ • Programa          │ • Filters/Pipes     │ • Frontend: listados y forms    │
│                     │                     │                                 │
│ 🚫 Mar 23          │ 🚫 Abr 2-3         │                                 │
│   (San José)        │   (Semana Santa)    │                                 │
├─────────────────────┴─────────────────────┴──────────────────────────────────┤
│                    TERCER CORTE (Release 2) — Cierre: 22 May 2026           │
│                          Integración y Despliegue                           │
├────────────────────────────────────┬─────────────────────────────────────────┤
│        Sprint 4                    │          Sprint 5                      │
│        Abr 20 → May 8             │          May 11 → May 22               │
│                                    │                                        │
│ • Frontend listados completos      │ • Integración de flujos               │
│ • Frontend formularios             │ • Pruebas de integración              │
│ • Navegación y layout              │ • Docker Compose validación           │
│ • Selects dinámicos                │ • README y documentación              │
│                                    │                                        │
│ 🚫 May 1                          │ 🚫 May 18                             │
│   (Día del Trabajo)               │   (Día de la Ascensión)               │
└────────────────────────────────────┴─────────────────────────────────────────┘
```

### Festivos Colombianos (Marzo — Mayo 2026)

| Fecha | Festivo | Sprint Afectado |
|---|---|---|
| Lunes 23 de Marzo | Día de San José | Sprint 1 |
| Jueves 2 de Abril | Jueves Santo | Sprint 2 |
| Viernes 3 de Abril | Viernes Santo | Sprint 2 |
| Viernes 1 de Mayo | Día del Trabajo | Sprint 4 |
| Lunes 18 de Mayo | Día de la Ascensión | Sprint 5 |

---

## ✅ Definition of Done (DoD)

> 📌 Referencia completa: [Issue #14](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/14)

Cada Historia de Usuario se considera **terminada** cuando cumple **todos** los siguientes criterios:

### Backend
- [x] Endpoint(s) implementados con arquitectura en capas: Controller → Service
- [x] DTOs con validaciones usando `class-validator` (`@IsString`, `@IsEmail`, `@IsNumber`, `@IsBoolean`, `@IsDateString`)
- [x] Manejo de errores con excepciones HTTP apropiadas (`NotFoundException`, `ConflictException`, `BadRequestException`)
- [x] Respuestas con formato uniforme via `ResponseInterceptor`: `{ statusCode, message: "OK", data }`
- [x] Errores con formato uniforme via `HttpExceptionFilter`: `{ statusCode, message, error }`
- [x] Smoke test correspondiente ejecutado y pasando

### Frontend
- [x] Página implementada con listado de entidades (`/[entidad]`)
- [x] Formulario de creación y edición integrado en la misma página
- [x] Consumo del API a través de la capa de `services/`
- [x] Manejo de estado: carga y error básicos

### Infraestructura y Código
- [x] Código versionado en GitHub con commits descriptivos
- [x] Las migraciones de Prisma están aplicadas (`prisma migrate dev`)
- [x] No hay errores de compilación TypeScript
- [x] `ValidationPipe` global con `whitelist: true, forbidNonWhitelisted: true`

---

## 🧪 Smoke Tests

Ubicación: `smoke-tests/` · Ejecutor: `node --test` (sin dependencias externas)

### Cómo ejecutar

```bash
# Requisito: backend corriendo en http://localhost:3001
cd smoke-tests
npm test

# O con PowerShell (verifica salud del backend antes de ejecutar):
./run-all.ps1
```

### Cobertura

| Suite | HU | Casos | Valida |
|---|---|---|---|
| `01-health.test.js` | HU-09 | 1 | Formato `{ statusCode, message, data }` |
| `02-programas.test.js` | HU-03 | 5 | CRUD + 409 código duplicado |
| `03-estudiantes.test.js` | HU-01 | 6 | CRUD + 409 correo duplicado |
| `04-docentes.test.js` | HU-02 | 6 | CRUD + 409 documento duplicado |
| `05-asignaturas.test.js` | HU-04 | 6 | CRUD + 404 FK inválida |
| `06-periodos.test.js` | HU-05 | 5 | CRUD + solo 1 período activo |
| `07-asignaciones.test.js` | HU-06 | 5 | Create + 409 clave compuesta |
| `08-matriculas.test.js` | HU-07 | 7 | CRUD + 409 + cancelación permitida |
| `09-calificaciones.test.js` | HU-08 | 6 | Fórmula ponderada + 409 + 400 al cancelar |
| **Total** | **9 HU** | **47** | |

---

## 📊 Tablero Kanban

🔗 [Ver tablero Kanban](https://github.com/users/jaquimbayoc7/projects/3)

| Todo | In Progress | Done |
|------|-------------|------|
| — | — | INFRA, HU-01…HU-11 (12 items) |

---

## ⚙ Instalación y Ejecución

> Esta sección contiene el detalle completo. Si solo quieres levantar el proyecto rápido, ve a [Inicio Rápido](#-inicio-rápido-para-estudiantes).

### Prerrequisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) y Docker Compose instalados
- [Node.js 22 LTS](https://nodejs.org/) (para desarrollo local y smoke tests)
- [Git](https://git-scm.com/downloads)

### Clonar el repositorio

```bash
git clone https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada.git
cd gestion-academica-sistema-avanzada
```

### Configurar variables de entorno

```bash
cp .env.example .env   # Linux/macOS
copy .env.example .env  # Windows
```

El archivo `.env.example` ya tiene valores listos para desarrollo:

```env
# .env — valores por defecto para desarrollo local
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gestion_academica

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gestion_academica"
PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

> ⚠️ **No compartas tu `.env` real en el repositorio.** El `.gitignore` ya lo excluye.

### Levantar con Docker (todo en uno)

```bash
docker compose up --build        # primera vez (construye imágenes)
docker compose up                # siguientes veces (sin reconstruir)
docker compose up -d             # modo silencioso (background)
docker compose logs -f backend   # ver logs del backend en tiempo real
docker compose down              # detener y eliminar contenedores
docker compose down -v           # detener y también borrar los datos
```

### Flujo de desarrollo local (hot-reload)

```bash
# 1. Solo la base de datos en Docker
docker compose up db

# 2. Migraciones Prisma (desde backend/)
cd backend
npm install
npx prisma migrate dev      # crea y aplica en desarrollo
npx prisma generate         # regenerar cliente si cambia el schema

# 3. Backend local (desde backend/)
npm run start:dev           # → http://localhost:3001

# 4. Frontend local (desde frontend/)
cd ../frontend
npm install
npm run dev                 # → http://localhost:3000
```

### Acceder a los servicios

| Servicio | URL |
|---|---|
| **Frontend (Next.js)** | [http://localhost:3000](http://localhost:3000) |
| **API REST (NestJS)** | [http://localhost:3001/api/v1](http://localhost:3001/api/v1) |
| **Health Check** | [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health) |
| **PostgreSQL** | `localhost:5432` · DB: `gestion_academica` |

### Ejecutar smoke tests

```bash
# Requisito: backend corriendo en localhost:3001
cd smoke-tests
npm install
npm test

# Con PowerShell (verifica salud del backend antes de ejecutar):
./run-all.ps1
```

---

## 🛠 Solución de Problemas

### Docker no levanta el backend

**Síntoma:** el backend queda en estado `unhealthy` o en bucle de reinicios.

```bash
# Ver los logs del backend para diagnosticar:
docker compose logs backend

# Solución más común: reconstruir desde cero
docker compose down -v
docker compose up --build
```

### Error: `port is already allocated`

Algún proceso ya usa el puerto 3000, 3001 o 5432.

```bash
# Windows — ver qué ocupa el puerto (ejemplo con 3001):
netstat -ano | findstr :3001
# Luego matar el proceso con su PID:
taskkill /PID <PID> /F

# Linux / macOS:
lsof -ti:3001 | xargs kill -9
```

### Error de Prisma: `P1001` o `Can't reach database server`

El backend intenta conectar a la base de datos antes de que esté lista.

```bash
# Espera unos segundos y vuelve a intentar, o reinicia solo el backend:
docker compose restart backend
```

### Las migraciones no se aplican

```bash
# Desde la carpeta backend/ con la base de datos corriendo:
npx prisma migrate dev
npx prisma generate
```

### El frontend no conecta con el backend (CORS / red)

Verifica que en tu `.env` la variable `NEXT_PUBLIC_API_URL` apunte a `http://localhost:3001/api/v1` (no a `db` ni al nombre de contenedor).

### Limpiar todo y empezar de cero

```bash
docker compose down -v          # elimina contenedores y volumen de datos
docker system prune -f          # elimina imágenes y caché sin usar
docker compose up --build       # reconstruye desde cero
```

---

## 📎 Enlaces Rápidos

| Recurso | Enlace |
|---|---|
| 📊 Insights del Proyecto | [INSIGHTS.md](./INSIGHTS.md) |
| 📋 Tablero Kanban | [GitHub Projects #3](https://github.com/users/jaquimbayoc7/projects/3) |
| 📌 Todos los Issues | [Ver Issues](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues?q=is%3Aissue) |
| ✅ Issues cerrados | [Sprint 1-5 Done](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues?q=is%3Aissue+is%3Aclosed) |
| 🏁 Milestone Sprint 1 | [Sprint 1](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/milestone/1) |
| 🏁 Milestone Sprint 2 | [Sprint 2](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/milestone/2) |
| 🏁 Milestone Sprint 3 | [Sprint 3](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/milestone/3) |
| 🏁 Milestone Sprint 4 | [Sprint 4](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/milestone/4) |
| 🏁 Milestone Sprint 5 | [Sprint 5](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/milestone/5) |
| 📖 Definition of Done | [Issue #14](https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada/issues/14) |

---

<p align="center">
  <strong>Programación Avanzada — Ingeniería de Sistemas — 2026A</strong><br>
  <em>Corporación Universitaria del Huila — CORHUILA</em><br><br>
  <sub>Hecho con ❤️ como proyecto demostrativo para el curso</sub>
</p>
