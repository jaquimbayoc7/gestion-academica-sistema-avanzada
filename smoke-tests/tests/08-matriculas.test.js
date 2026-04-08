// ============================================================
// 08 — Matrículas (HU-07 · Sprint 3)
// CA: unicidad compuesta, cancelar solo si no hay calificación
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { get, post, del, assertStatus, assertField } from "./helpers.js";

const TS = Date.now();
let programaId, asignaturaId, docenteId, periodoId, asignacionId, estudianteId, matriculaId;

test("Setup — crear entidades auxiliares para matrícula", async () => {
  const pa = await post("/programa-academico", { nombre: "P Aux Mat", codigo: `PA-MT-${TS}`, facultad: "T", duracionSemestres: 4 });
  programaId = pa.body.data.id;

  const asig = await post("/asignatura", { nombre: "Materia Mat", codigo: `M-MT-${TS}`, creditos: 3, programaAcademicoId: programaId });
  asignaturaId = asig.body.data.id;

  const doc = await post("/docente", { nombres: "Prof Mat", apellidos: "MT", documentoIdentidad: `DM-${TS}`, tituloProfesional: "MSc", especialidad: "Test", correoInstitucional: `profm${TS}@t.edu` });
  docenteId = doc.body.data.id;

  const per = await post("/periodo-academico", { nombre: `PER-MT-${TS}`, fechaInicio: "2026-01-01", fechaFin: "2026-06-30", activo: false });
  periodoId = per.body.data.id;

  const asign = await post("/asignacion-docente", { docenteId, asignaturaId, periodoAcademicoId: periodoId });
  asignacionId = asign.body.data.id;

  const est = await post("/estudiante", { nombres: "Est Mat", apellidos: "MT", codigoEstudiantil: `EM-${TS}`, documentoIdentidad: `EDM-${TS}`, correoInstitucional: `estm${TS}@t.edu`, fechaNacimiento: "2002-03-10", programaAcademicoId: programaId });
  estudianteId = est.body.data.id;

  assert.ok(asignacionId && estudianteId, "Setup completo");
});

test("POST /matricula → crea matrícula y retorna 201", async () => {
  const { status, body } = await post("/matricula", {
    estudianteId,
    asignacionDocenteId: asignacionId,
  });
  assertStatus(status, 201, "crear matrícula");
  assertField(body.data, "id", "crear matrícula");
  matriculaId = body.data.id;
});

test("POST /matricula duplicada → 409 Conflict", async () => {
  const { status } = await post("/matricula", {
    estudianteId,
    asignacionDocenteId: asignacionId,
  });
  assertStatus(status, 409, "matrícula duplicada");
});

test("GET /matricula?estudianteId= → filtra por estudiante", async () => {
  const { status, body } = await get(`/matricula?estudianteId=${estudianteId}`);
  assertStatus(status, 200, "filtrar matrículas por estudiante");
  assert.ok(body.data.every((m) => m.estudianteId === estudianteId));
});

test("DELETE /matricula/:id sin calificación → cancela correctamente", async () => {
  const { status } = await del(`/matricula/${matriculaId}`);
  assertStatus(status, 200, "cancelar matrícula");
  matriculaId = null;
});

test("Teardown — eliminar entidades auxiliares", async () => {
  await del(`/estudiante/${estudianteId}`);
  await del(`/asignacion-docente/${asignacionId}`);
  await del(`/docente/${docenteId}`);
  await del(`/asignatura/${asignaturaId}`);
  await del(`/periodo-academico/${periodoId}`);
  await del(`/programa-academico/${programaId}`);
});
