"use client";

import { useEffect, useState } from "react";
import { periodosService, PeriodoAcademico, CreatePeriodoDto } from "@/services/periodos.service";

const emptyForm: CreatePeriodoDto = { nombre: "", fechaInicio: "", fechaFin: "", activo: false };

export default function PeriodosPage() {
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PeriodoAcademico | null>(null);
  const [form, setForm] = useState<CreatePeriodoDto>(emptyForm);

  const load = async () => {
    try { setPeriodos(await periodosService.findAll()); }
    catch { setError("Error al cargar los períodos"); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const notify = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      if (editing) { await periodosService.update(editing.id, form); notify("Período actualizado"); }
      else { await periodosService.create(form); notify("Período creado"); }
      setForm(emptyForm); setEditing(null); setShowForm(false); await load();
    } catch (err: unknown) { const e = err as { messages?: string[] }; setError(e.messages?.join(", ") ?? "Error al guardar"); }
  };

  const handleEdit = (p: PeriodoAcademico) => {
    setEditing(p);
    setForm({ nombre: p.nombre, fechaInicio: p.fechaInicio.split("T")[0], fechaFin: p.fechaFin.split("T")[0], activo: p.activo });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este período?")) return; setError(null);
    try { await periodosService.remove(id); notify("Período eliminado"); await load(); }
    catch (err: unknown) { const e = err as { messages?: string[] }; setError(e.messages?.join(", ") ?? "Error al eliminar"); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">📅 Períodos Académicos</h1>
          <p className="text-sm text-zinc-500 mt-1">Sprint 2 · HU-05 · Solo puede haber un período activo a la vez</p>
        </div>
        {!showForm && <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">+ Nuevo Período</button>}
      </div>

      {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>}
      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl">
          <h2 className="font-semibold text-zinc-800 mb-4">{editing ? "Editar Período" : "Nuevo Período"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre</label>
              <input className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: 2026-1" required />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer">
                <input type="checkbox" checked={form.activo ?? false} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="rounded" />
                Período Activo
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Fecha Inicio</label>
              <input type="date" className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Fecha Fin</label>
              <input type="date" className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" value={form.fechaFin} onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">{editing ? "Actualizar" : "Crear"}</button>
            <button type="button" onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(false); setError(null); }} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? <p className="text-zinc-500 text-sm">Cargando...</p> : periodos.length === 0 ? <p className="text-zinc-400 text-sm">No hay períodos registrados.</p> : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Fecha Inicio</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Fecha Fin</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {periodos.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">{p.nombre}</td>
                  <td className="px-4 py-3 text-zinc-600">{new Date(p.fechaInicio).toLocaleDateString("es-CO")}</td>
                  <td className="px-4 py-3 text-zinc-600">{new Date(p.fechaFin).toLocaleDateString("es-CO")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.activo ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                      {p.activo ? "✅ Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-xs px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors">Eliminar</button>
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
