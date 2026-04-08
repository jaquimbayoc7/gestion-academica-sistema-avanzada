// ============================================================
// 03 — Estudiantes (HU-01 · Sprint 1)
// CA: CRUD completo, unicidad de código, documento y correo
// DoD: validaciones de unicidad activas
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { get, post, put, del, assertStatus, assertField } from "./helpers.js";

const TS = Date.now();
let programaId, estudianteId;

// Crear programa auxiliar
test("Setup — crear programa para FK de estudiante", async () => {
  const { body } = await post("/programa-academico", {
    nombre: "Programa Aux Estudiante",
    codigo: `AUX-E-${TS}`,
    facultad: "Test",
    duracionSemestres: 6,
  });
  programaId = body.data.id;
  assert.ok(programaId, "debe crearse el programa auxiliar");
});

test("POST /estudiante → crea estudiante y retorna 201", async () => {
  const { status, body } = await post("/estudiante", {
    nombres: "Juan Smoke",
    apellidos: "Pérez Test",
    codigoEstudiantil: `COD-${TS}`,
    documentoIdentidad: `DOC-${TS}`,
    correoInstitucional: `smoke${TS}@test.edu`,
    fechaNacimiento: "2000-01-15",
    programaAcademicoId: programaId,
  });
  assertStatus(status, 201, "crear estudiante");
  assertField(body.data, "id", "crear estudiante");
  estudianteId = body.data.id;
});

test("GET /estudiante → lista incluye el estudiante creado", async () => {
  const { status, body } = await get("/estudiante");
  assertStatus(status, 200, "listar estudiantes");
  assert.ok(body.data.find((e) => e.id === estudianteId));
});

test("PUT /estudiante/:id → actualiza apellidos", async () => {
  const { status, body } = await put(`/estudiante/${estudianteId}`, {
    apellidos: "Pérez Actualizado",
  });
  assertStatus(status, 200, "actualizar estudiante");
  assert.equal(body.data.apellidos, "Pérez Actualizado");
});

test("POST /estudiante con correo duplicado → 409 Conflict", async () => {
  const { status } = await post("/estudiante", {
    nombres: "Otro",
    apellidos: "Otro",
    codigoEstudiantil: `COD2-${TS}`,
    documentoIdentidad: `DOC2-${TS}`,
    correoInstitucional: `smoke${TS}@test.edu`,
    fechaNacimiento: "2001-05-20",
    programaAcademicoId: programaId,
  });
  assertStatus(status, 409, "correo duplicado");
});

test("Teardown — eliminar estudiante y programa auxiliar", async () => {
  await del(`/estudiante/${estudianteId}`);
  await del(`/programa-academico/${programaId}`);
});
