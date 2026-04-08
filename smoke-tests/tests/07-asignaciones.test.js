// ============================================================
// 07 — Asignación de Docente (HU-06 · Sprint 2)
// CA: unicidad compuesta (docente+asignatura+período), inmutable
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { get, post, del, assertStatus, assertField } from "./helpers.js";

const TS = Date.now();
let programaId, asignaturaId, docenteId, periodoId, asignacionId;

test("Setup — crear entidades auxiliares para asignación", async () => {
  const pa = await post("/programa-academico", { nombre: "P Aux Asig", codigo: `PA-AS-${TS}`, facultad: "T", duracionSemestres: 4 });
  programaId = pa.body.data.id;

  const asig = await post("/asignatura", { nombre: "Materia Smoke", codigo: `M-AS-${TS}`, creditos: 3, programaAcademicoId: programaId });
  asignaturaId = asig.body.data.id;

  const doc = await post("/docente", { nombres: "Prof Smoke", apellidos: "AS", documentoIdentidad: `DA-${TS}`, tituloProfesional: "MSc", especialidad: "Test", correoInstitucional: `prof${TS}@t.edu` });
  docenteId = doc.body.data.id;

  const per = await post("/periodo-academico", { nombre: `PER-AS-${TS}`, fechaInicio: "2026-01-01", fechaFin: "2026-06-30", activo: false });
  periodoId = per.body.data.id;

  assert.ok(programaId && asignaturaId && docenteId && periodoId, "Setup completo");
});

test("POST /asignacion-docente → crea asignación y retorna 201", async () => {
  const { status, body } = await post("/asignacion-docente", {
    docenteId,
    asignaturaId,
    periodoAcademicoId: periodoId,
  });
  assertStatus(status, 201, "crear asignación");
  assertField(body.data, "id", "crear asignación");
  asignacionId = body.data.id;
});

test("POST /asignacion-docente duplicada → 409 Conflict", async () => {
  const { status } = await post("/asignacion-docente", {
    docenteId,
    asignaturaId,
    periodoAcademicoId: periodoId,
  });
  assertStatus(status, 409, "asignación duplicada");
});

test("GET /asignacion-docente → incluye la asignación creada", async () => {
  const { status, body } = await get("/asignacion-docente");
  assertStatus(status, 200, "listar asignaciones");
  assert.ok(body.data.find((a) => a.id === asignacionId));
});

test("Teardown — eliminar asignación y entidades auxiliares", async () => {
  await del(`/asignacion-docente/${asignacionId}`);
  await del(`/docente/${docenteId}`);
  await del(`/asignatura/${asignaturaId}`);
  await del(`/periodo-academico/${periodoId}`);
  await del(`/programa-academico/${programaId}`);
});
