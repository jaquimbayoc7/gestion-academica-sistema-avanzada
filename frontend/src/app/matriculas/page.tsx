"use client";

import { useEffect, useState } from "react";
import { matriculasService, Matricula, CreateMatriculaDto } from "@/services/matriculas.service";
import { estudiantesService, Estudiante } from "@/services/estudiantes.service";
import { asignacionesService, AsignacionDocente } from "@/services/asignaciones.service";

const emptyForm: CreateMatriculaDto = { estudianteId: 0, asignacionDocenteId: 0 };

export default function MatriculasPage() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionDocente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateMatriculaDto>(emptyForm);

  const load = async () => {
    try {
      const [m, e, a] = await Promise.all([
        matriculasService.findAll(),
        estudiantesService.findAll(),
        asignacionesService.findAll(),
      ]);
      setMatriculas(m); setEstudiantes(e); setAsignaciones(a);
    } catch { setError("Error al cargar los datos"); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const notify = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      await matriculasService.create(form);
      notify("Matrícula registrada correctamente");
      setForm(emptyForm); setShowForm(false); await load();
    } catch (err: unknown) { const e = err as { messages?: string[] }; setError(e.messages?.join(", ") ?? "Error al guardar"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Cancelar esta matrícula? Solo es posible si no tiene calificaciones.")) return;
    setError(null);
    try { await matriculasService.remove(id); notify("Matrícula cancelada"); await load(); }
    catch (err: unknown) { const e = err as { messages?: string[] }; setError(e.messages?.join(", ") ?? "Error al cancelar"); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">📝 Matrículas</h1>
          <p className="text-sm text-zinc-500 mt-1">Sprint 3 · HU-07 · Inscripción de estudiantes en asignaturas</p>
        </div>
        {!showForm && <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">+ Nueva Matrícula</button>}
      </div>

      {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>}
      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl">
          <h2 className="font-semibold text-zinc-800 mb-4">Nueva Matrícula</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Asignación (Período → Asignatura → Docente)</label>
              <select className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.asignacionDocenteId} onChange={(e) => setForm({ ...form, asignacionDocenteId: Number(e.target.value) })} required>
                <option value={0} disabled>Seleccionar asignación...</option>
                {asignaciones.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.periodoAcademico?.nombre} — {a.asignatura?.nombre} ({a.asignatura?.codigo}) — {a.docente?.nombres} {a.docente?.apellidos}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Estudiante</label>
              <select className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.estudianteId} onChange={(e) => setForm({ ...form, estudianteId: Number(e.target.value) })} required>
                <option value={0} disabled>Seleccionar estudiante...</option>
                {estudiantes.map((e) => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos} — {e.codigoEstudiantil}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">Matricular</button>
            <button type="button" onClick={() => { setForm(emptyForm); setShowForm(false); setError(null); }} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? <p className="text-zinc-500 text-sm">Cargando...</p> : matriculas.length === 0 ? <p className="text-zinc-400 text-sm">No hay matrículas registradas.</p> : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Estudiante</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Asignatura</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Período</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Fecha Inscripción</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nota Def.</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {matriculas.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">{m.estudiante ? `${m.estudiante.nombres} ${m.estudiante.apellidos}` : "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{m.asignacionDocente?.asignatura?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{m.asignacionDocente?.periodoAcademico?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{new Date(m.fechaInscripcion).toLocaleDateString("es-CO")}</td>
                  <td className="px-4 py-3">
                    {m.calificacion ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.calificacion.notaDefinitiva >= 3.0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {m.calificacion.notaDefinitiva.toFixed(1)} {m.calificacion.notaDefinitiva >= 3.0 ? "✅" : "❌"}
                      </span>
                    ) : <span className="text-zinc-400 text-xs">Sin nota</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(m.id)} disabled={!!m.calificacion} className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
