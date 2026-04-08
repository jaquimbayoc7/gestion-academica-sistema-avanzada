// ============================================================
// 05 — Asignaturas (HU-04 · Sprint 2)
// CA: CRUD, unicidad de código, FK a ProgramaAcademico
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { get, post, put, del, assertStatus, assertField } from "./helpers.js";

const TS = Date.now();
let programaId, asignaturaId;

test("Setup — crear programa auxiliar para asignatura", async () => {
  const { body } = await post("/programa-academico", {
    nombre: "Programa Aux Asignatura",
    codigo: `AUX-A-${TS}`,
    facultad: "Test",
    duracionSemestres: 6,
  });
  programaId = body.data.id;
  assert.ok(programaId);
});

test("POST /asignatura → crea asignatura y retorna 201", async () => {
  const { status, body } = await post("/asignatura", {
    nombre: "Algoritmos Smoke",
    codigo: `ASG-${TS}`,
    creditos: 3,
    programaAcademicoId: programaId,
  });
  assertStatus(status, 201, "crear asignatura");
  assertField(body.data, "id", "crear asignatura");
  asignaturaId = body.data.id;
});

test("GET /asignatura → incluye la asignatura creada", async () => {
  const { status, body } = await get("/asignatura");
  assertStatus(status, 200, "listar asignaturas");
  assert.ok(body.data.find((a) => a.id === asignaturaId));
});

test("PUT /asignatura/:id → actualiza créditos", async () => {
  const { status, body } = await put(`/asignatura/${asignaturaId}`, { creditos: 4 });
  assertStatus(status, 200, "actualizar asignatura");
  assert.equal(body.data.creditos, 4);
});

test("POST /asignatura con FK inexistente → 404 Not Found", async () => {
  const { status } = await post("/asignatura", {
    nombre: "Sin Programa",
    codigo: `NOFK-${TS}`,
    creditos: 2,
    programaAcademicoId: 999999,
  });
  assertStatus(status, 404, "FK inexistente");
});

test("Teardown — eliminar asignatura y programa", async () => {
  await del(`/asignatura/${asignaturaId}`);
  await del(`/programa-academico/${programaId}`);
});
