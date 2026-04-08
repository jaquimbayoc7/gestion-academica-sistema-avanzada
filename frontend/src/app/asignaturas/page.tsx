"use client";

import { useEffect, useState } from "react";
import { asignaturasService, Asignatura, CreateAsignaturaDto } from "@/services/asignaturas.service";
import { programasService, ProgramaAcademico } from "@/services/programas.service";

const emptyForm: CreateAsignaturaDto = { nombre: "", codigo: "", creditos: 3, programaAcademicoId: 0 };

export default function AsignaturasPage() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [programas, setProgramas] = useState<ProgramaAcademico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Asignatura | null>(null);
  const [form, setForm] = useState<CreateAsignaturaDto>(emptyForm);

  const load = async () => {
    try {
      const [a, p] = await Promise.all([asignaturasService.findAll(), programasService.findAll()]);
      setAsignaturas(a); setProgramas(p);
    } catch { setError("Error al cargar los datos"); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const notify = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      if (editing) { await asignaturasService.update(editing.id, form); notify("Asignatura actualizada"); }
      else { await asignaturasService.create(form); notify("Asignatura creada"); }
      setForm(emptyForm); setEditing(null); setShowForm(false); await load();
    } catch (err: unknown) { const e = err as { messages?: string[] }; setError(e.messages?.join(", ") ?? "Error al guardar"); }
  };

  const handleEdit = (a: Asignatura) => {
    setEditing(a); setForm({ nombre: a.nombre, codigo: a.codigo, creditos: a.creditos, programaAcademicoId: a.programaAcademicoId }); setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta asignatura?")) return; setError(null);
    try { await asignaturasService.remove(id); notify("Asignatura eliminada"); await load(); }
    catch (err: unknown) { const e = err as { messages?: string[] }; setError(e.messages?.join(", ") ?? "Error al eliminar"); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">📚 Asignaturas</h1>
          <p className="text-sm text-zinc-500 mt-1">Sprint 2 · HU-04</p>
        </div>
        {!showForm && <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">+ Nueva Asignatura</button>}
      </div>

      {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>}
      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl">
          <h2 className="font-semibold text-zinc-800 mb-4">{editing ? "Editar Asignatura" : "Nueva Asignatura"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre</label>
              <input className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Código</label>
              <input className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Créditos</label>
              <input type="number" min={1} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.creditos} onChange={(e) => setForm({ ...form, creditos: Number(e.target.value) })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Programa Académico</label>
              <select className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.programaAcademicoId} onChange={(e) => setForm({ ...form, programaAcademicoId: Number(e.target.value) })} required>
                <option value={0} disabled>Seleccionar...</option>
                {programas.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">{editing ? "Actualizar" : "Crear"}</button>
            <button type="button" onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(false); setError(null); }} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? <p className="text-zinc-500 text-sm">Cargando...</p> : asignaturas.length === 0 ? <p className="text-zinc-400 text-sm">No hay asignaturas registradas.</p> : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Código</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Créditos</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Programa</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {asignaturas.map((a) => (
                <tr key={a.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">{a.nombre}</td>
                  <td className="px-4 py-3 text-zinc-600">{a.codigo}</td>
                  <td className="px-4 py-3 text-zinc-600">{a.creditos}</td>
                  <td className="px-4 py-3 text-zinc-600">{a.programaAcademico?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(a)} className="text-xs px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors">Editar</button>
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
