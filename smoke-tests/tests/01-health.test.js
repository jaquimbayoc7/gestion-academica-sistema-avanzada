// ============================================================
// 01 — Health: el servidor responde
// HU-09: Common Module activo (interceptor devuelve { statusCode, message, data })
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { get, assertStatus } from "./helpers.js";

test("GET /programa-academico → 200 y estructura de respuesta correcta", async () => {
  const { status, body } = await get("/programa-academico");
  assertStatus(status, 200, "health");
  assert.equal(body.statusCode, 200, "statusCode debe ser 200");
  assert.equal(body.message, "OK", "message debe ser OK");
  assert.ok(Array.isArray(body.data), "data debe ser un array");
});
