# 🔥 Smoke Tests — Sistema de Gestión Académica

Pruebas rápidas de humo para verificar que todos los endpoints del sistema responden correctamente.

## Requisitos

- Backend corriendo en `http://localhost:3001`
- Base de datos PostgreSQL activa con migraciones aplicadas
- Node.js instalado

## Ejecución

```bash
cd smoke-tests
npm install
npm test
```

## Estructura

```
smoke-tests/
├── README.md
├── package.json
├── run-all.ps1          # Script PowerShell para correr todas las pruebas
└── tests/
    ├── 01-health.test.js
    ├── 02-programas.test.js
    ├── 03-estudiantes.test.js
    ├── 04-docentes.test.js
    ├── 05-asignaturas.test.js
    ├── 06-periodos.test.js
    ├── 07-asignaciones.test.js
    ├── 08-matriculas.test.js
    └── 09-calificaciones.test.js
```
