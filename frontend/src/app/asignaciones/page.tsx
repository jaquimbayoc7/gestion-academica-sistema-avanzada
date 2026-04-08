"use client";

import { useEffect, useState } from "react";
import { asignacionesService, AsignacionDocente, CreateAsignacionDto } from "@/services/asignaciones.service";
import { docentesService, Docente } from "@/services/docentes.service";
import { asignaturasService, Asignatura } from "@/services/asignaturas.service";
import { periodosService, PeriodoAcademico } from "@/services/periodos.service";

const emptyForm: CreateAsignacionDto = { docenteId: 0, asignaturaId: 0, periodoAcademicoId: 0 };

export default function AsignacionesPage() {
  const [asignaciones, setAsignaciones] = useState<AsignacionDocente[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateAsignacionDto>(emptyForm);

  const load = async () => {
    try {
      const [a, d, as_, p] = await Promise.all([
        asignacionesService.findAll(), docentesService.findAll(),
        asignaturasService.findAll(), periodosService.findAll(),
      ]);
      setAsignaciones(a); setDocentes(d); setAsignaturas(as_); setPeriodos(p);
    } catch { setError("Error al cargar los datos"); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const notify = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      await asignacionesService.create(form);
      notify("Asignación creada correctamente");
      setForm(emptyForm); setShowForm(false); await load();
    } catch (err: unknown) { const e = err as { messages?: string[] }; setError(e.messages?.join(", ") ?? "Error al guardar"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta asignación?")) return; setError(null);
    try { await asignacionesService.remove(id); notify("Asignación eliminada"); await load(); }
    catch (err: unknown) { const e = err as { messages?: string[] }; setError(e.messages?.join(", ") ?? "Error al eliminar"); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">🔗 Asignaciones Docente</h1>
          <p className="text-sm text-zinc-500 mt-1">Sprint 2 · HU-06 · Docente → Asignatura por Período</p>
        </div>
        {!showForm && <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">+ Nueva Asignación</button>}
      </div>

      {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>}
      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl">
          <h2 className="font-semibold text-zinc-800 mb-4">Nueva Asignación</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Período Académico</label>
              <select className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.periodoAcademicoId} onChange={(e) => setForm({ ...form, periodoAcademicoId: Number(e.target.value) })} required>
                <option value={0} disabled>Seleccionar...</option>
                {periodos.map((p) => <option key={p.id} value={p.id}>{p.nombre} {p.activo ? "✅" : ""}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Asignatura</label>
              <select className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.asignaturaId} onChange={(e) => setForm({ ...form, asignaturaId: Number(e.target.value) })} required>
                <option value={0} disabled>Seleccionar...</option>
                {asignaturas.map((a) => <option key={a.id} value={a.id}>{a.nombre} ({a.codigo})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Docente</label>
              <select className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.docenteId} onChange={(e) => setForm({ ...form, docenteId: Number(e.target.value) })} required>
                <option value={0} disabled>Seleccionar...</option>
                {docentes.map((d) => <option key={d.id} value={d.id}>{d.nombres} {d.apellidos}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">Crear</button>
            <button type="button" onClick={() => { setForm(emptyForm); setShowForm(false); setError(null); }} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? <p className="text-zinc-500 text-sm">Cargando...</p> : asignaciones.length === 0 ? <p className="text-zinc-400 text-sm">No hay asignaciones registradas.</p> : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Docente</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Asignatura</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Período</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {asignaciones.map((a) => (
                <tr key={a.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">{a.docente ? `${a.docente.nombres} ${a.docente.apellidos}` : "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{a.asignatura ? `${a.asignatura.nombre} (${a.asignatura.codigo})` : "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{a.periodoAcademico?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(a.id)} className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors">Eliminar</button>
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
