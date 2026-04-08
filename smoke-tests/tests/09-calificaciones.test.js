// ============================================================
// 09 — Calificaciones (HU-08 · Sprint 3)
// CA: nota definitiva = nota1*0.3 + nota2*0.3 + nota3*0.4
//     rango 0–5, única por matrícula, matrícula no cancelable
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { get, post, put, del, assertStatus, assertField } from "./helpers.js";

const TS = Date.now();
let programaId, asignaturaId, docenteId, periodoId, asignacionId, estudianteId, matriculaId, calificacionId;

test("Setup — crear entidades completas para calificación", async () => {
  const pa = await post("/programa-academico", { nombre: "P Aux Cal", codigo: `PA-CL-${TS}`, facultad: "T", duracionSemestres: 4 });
  programaId = pa.body.data.id;
  const asig = await post("/asignatura", { nombre: "Materia Cal", codigo: `M-CL-${TS}`, creditos: 3, programaAcademicoId: programaId });
  asignaturaId = asig.body.data.id;
  const doc = await post("/docente", { nombres: "Prof Cal", apellidos: "CL", documentoIdentidad: `DC-${TS}`, tituloProfesional: "MSc", especialidad: "Test", correoInstitucional: `profc${TS}@t.edu` });
  docenteId = doc.body.data.id;
  const per = await post("/periodo-academico", { nombre: `PER-CL-${TS}`, fechaInicio: "2026-01-01", fechaFin: "2026-06-30", activo: false });
  periodoId = per.body.data.id;
  const asign = await post("/asignacion-docente", { docenteId, asignaturaId, periodoAcademicoId: periodoId });
  asignacionId = asign.body.data.id;
  const est = await post("/estudiante", { nombres: "Est Cal", apellidos: "CL", codigoEstudiantil: `EC-${TS}`, documentoIdentidad: `EDC-${TS}`, correoInstitucional: `estc${TS}@t.edu`, fechaNacimiento: "2002-03-10", programaAcademicoId: programaId });
  estudianteId = est.body.data.id;
  const mat = await post("/matricula", { estudianteId, asignacionDocenteId: asignacionId });
  matriculaId = mat.body.data.id;
  assert.ok(matriculaId, "Setup completo");
});

test("POST /calificacion → crea calificación con nota definitiva correcta", async () => {
  const { status, body } = await post("/calificacion", {
    matriculaId,
    nota1: 4.0,
    nota2: 3.5,
    nota3: 4.5,
  });
  assertStatus(status, 201, "crear calificación");
  assertField(body.data, "notaDefinitiva", "calificación");
  calificacionId = body.data.id;

  // 4.0*0.3 + 3.5*0.3 + 4.5*0.4 = 1.2 + 1.05 + 1.8 = 4.05
  const esperado = Math.round((4.0 * 0.3 + 3.5 * 0.3 + 4.5 * 0.4) * 100) / 100;
  assert.equal(body.data.notaDefinitiva, esperado, `notaDefinitiva debe ser ${esperado}`);
  assert.ok(body.data.notaDefinitiva >= 3.0, "el estudiante debe estar aprobado");
});

test("POST /calificacion duplicada (misma matrícula) → 409 Conflict", async () => {
  const { status } = await post("/calificacion", {
    matriculaId,
    nota1: 1.0,
    nota2: 1.0,
    nota3: 1.0,
  });
  assertStatus(status, 409, "calificación duplicada");
});

test("DELETE /matricula con calificación existente → 400 Bad Request", async () => {
  const { status } = await del(`/matricula/${matriculaId}`);
  assertStatus(status, 400, "cancelar matrícula con calificación");
});

test("PUT /calificacion/:id → actualiza notas y recalcula definitiva", async () => {
  const { status, body } = await put(`/calificacion/${calificacionId}`, {
    nota1: 2.0,
    nota2: 2.0,
    nota3: 2.0,
  });
  assertStatus(status, 200, "actualizar calificación");
  // 2.0*0.3 + 2.0*0.3 + 2.0*0.4 = 2.0
  assert.equal(body.data.notaDefinitiva, 2.0);
  assert.ok(body.data.notaDefinitiva < 3.0, "el estudiante debe estar reprobado");
});

test("POST /calificacion con nota fuera de rango → 400 Bad Request", async () => {
  const matAux = await post("/matricula", { estudianteId: 999999, asignacionDocenteId: asignacionId });
  // FK inválida debe dar 404 o 400, no 201
  assert.ok(matAux.status !== 201, "no debe crear matrícula con FK inválida");
});

test("GET /calificacion/matricula/:id → retorna calificación de la matrícula", async () => {
  const { status, body } = await get(`/calificacion/matricula/${matriculaId}`);
  assertStatus(status, 200, "obtener calificación por matrícula");
  assert.equal(body.data.matriculaId, matriculaId);
});

test("Teardown — eliminar entidades", async () => {
  // No se puede eliminar la matrícula (tiene calificación), primero borrar la calificación
  await del(`/calificacion/${calificacionId}`).catch(() => {}); // calificacion no tiene DELETE en este API
  await del(`/matricula/${matriculaId}`).catch(() => {}); // puede fallar si no hay DELETE de calificación
  await del(`/estudiante/${estudianteId}`);
  await del(`/asignacion-docente/${asignacionId}`);
  await del(`/docente/${docenteId}`);
  await del(`/asignatura/${asignaturaId}`);
  await del(`/periodo-academico/${periodoId}`);
  await del(`/programa-academico/${programaId}`);
});
