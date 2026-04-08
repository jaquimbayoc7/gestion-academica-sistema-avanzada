// ============================================================
// 04 — Docentes (HU-02 · Sprint 1)
// CA: CRUD completo, unicidad de documento y correo
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { get, post, put, del, assertStatus, assertField } from "./helpers.js";

const TS = Date.now();
let docenteId;

test("POST /docente → crea docente y retorna 201", async () => {
  const { status, body } = await post("/docente", {
    nombres: "María Smoke",
    apellidos: "López Test",
    documentoIdentidad: `DDOC-${TS}`,
    tituloProfesional: "Magíster en Sistemas",
    especialidad: "Backend",
    correoInstitucional: `docente${TS}@test.edu`,
  });
  assertStatus(status, 201, "crear docente");
  assertField(body.data, "id", "crear docente");
  docenteId = body.data.id;
});

test("GET /docente → lista incluye el docente creado", async () => {
  const { status, body } = await get("/docente");
  assertStatus(status, 200, "listar docentes");
  assert.ok(body.data.find((d) => d.id === docenteId));
});

test("PUT /docente/:id → actualiza especialidad", async () => {
  const { status, body } = await put(`/docente/${docenteId}`, {
    especialidad: "Full Stack",
  });
  assertStatus(status, 200, "actualizar docente");
  assert.equal(body.data.especialidad, "Full Stack");
});

test("POST /docente con documento duplicado → 409 Conflict", async () => {
  const { status } = await post("/docente", {
    nombres: "Otro",
    apellidos: "Otro",
    documentoIdentidad: `DDOC-${TS}`,
    tituloProfesional: "PhD",
    especialidad: "Test",
    correoInstitucional: `otro${TS}@test.edu`,
  });
  assertStatus(status, 409, "documento duplicado");
});

test("Teardown — eliminar docente", async () => {
  await del(`/docente/${docenteId}`);
});
