// ============================================================
// 02 — Programas Académicos (HU-03 · Sprint 1)
// CA: CRUD completo, unicidad de código
// DoD: endpoints responden, código único validado
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { get, post, put, del, assertStatus, assertField } from "./helpers.js";

const CODIGO = `SMOKE-PA-${Date.now()}`;
let id;

test("POST /programa-academico → crea programa y retorna 201", async () => {
  const { status, body } = await post("/programa-academico", {
    nombre: "Programa Smoke Test",
    codigo: CODIGO,
    facultad: "Ingeniería",
    duracionSemestres: 8,
  });
  assertStatus(status, 201, "crear programa");
  assertField(body.data, "id", "crear programa");
  assert.equal(body.data.codigo, CODIGO);
  id = body.data.id;
});

test("GET /programa-academico → lista incluye el programa creado", async () => {
  const { status, body } = await get("/programa-academico");
  assertStatus(status, 200, "listar programas");
  const found = body.data.find((p) => p.id === id);
  assert.ok(found, "el programa creado debe estar en la lista");
});

test("GET /programa-academico/:id → retorna el programa por id", async () => {
  const { status, body } = await get(`/programa-academico/${id}`);
  assertStatus(status, 200, "obtener programa por id");
  assert.equal(body.data.id, id);
});

test("PUT /programa-academico/:id → actualiza nombre correctamente", async () => {
  const { status, body } = await put(`/programa-academico/${id}`, {
    nombre: "Programa Smoke Actualizado",
  });
  assertStatus(status, 200, "actualizar programa");
  assert.equal(body.data.nombre, "Programa Smoke Actualizado");
});

test("POST /programa-academico con código duplicado → 409 Conflict", async () => {
  const { status } = await post("/programa-academico", {
    nombre: "Duplicado",
    codigo: CODIGO,
    facultad: "Ciencias",
    duracionSemestres: 4,
  });
  assertStatus(status, 409, "código duplicado");
});

test("DELETE /programa-academico/:id → elimina el programa", async () => {
  const { status } = await del(`/programa-academico/${id}`);
  assertStatus(status, 200, "eliminar programa");
});
