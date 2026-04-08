// ============================================================
// 06 — Períodos Académicos (HU-05 · Sprint 2)
// CA: solo 1 activo a la vez, CRUD completo
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { get, post, put, del, assertStatus, assertField } from "./helpers.js";

const TS = Date.now();
let periodo1Id, periodo2Id;

test("POST /periodo-academico → crea período activo", async () => {
  const { status, body } = await post("/periodo-academico", {
    nombre: `2026-SMOKE-${TS}`,
    fechaInicio: "2026-01-15",
    fechaFin: "2026-06-30",
    activo: true,
  });
  assertStatus(status, 201, "crear período activo");
  assertField(body.data, "id", "crear período");
  periodo1Id = body.data.id;
  assert.equal(body.data.activo, true);
});

test("POST /periodo-academico con activo:true → desactiva el anterior", async () => {
  const { status, body } = await post("/periodo-academico", {
    nombre: `2026-SMOKE2-${TS}`,
    fechaInicio: "2026-07-01",
    fechaFin: "2026-12-31",
    activo: true,
  });
  assertStatus(status, 201, "crear segundo período activo");
  periodo2Id = body.data.id;

  // El primer período debe estar inactivo ahora
  const { body: b1 } = await get(`/periodo-academico/${periodo1Id}`);
  assert.equal(b1.data.activo, false, "el período anterior debe quedar inactivo");
});

test("GET /periodo-academico → lista los períodos", async () => {
  const { status, body } = await get("/periodo-academico");
  assertStatus(status, 200, "listar períodos");
  assert.ok(Array.isArray(body.data));
});

test("Teardown — eliminar períodos", async () => {
  await del(`/periodo-academico/${periodo2Id}`);
  await del(`/periodo-academico/${periodo1Id}`);
});
