"use client";

import { useEffect, useState } from "react";
import {
  programasService,
  ProgramaAcademico,
  CreateProgramaDto,
} from "@/services/programas.service";

const emptyForm: CreateProgramaDto = {
  nombre: "",
  codigo: "",
  facultad: "",
  duracionSemestres: 8,
};

export default function ProgramasPage() {
  const [programas, setProgramas] = useState<ProgramaAcademico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProgramaAcademico | null>(null);
  const [form, setForm] = useState<CreateProgramaDto>(emptyForm);

  const load = async () => {
    try {
      const data = await programasService.findAll();
      setProgramas(data);
    } catch {
      setError("Error al cargar los programas académicos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const notify = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing) {
        await programasService.update(editing.id, form);
        notify("Programa actualizado correctamente");
      } else {
        await programasService.create(form);
        notify("Programa creado correctamente");
      }
      setForm(emptyForm);
      setEditing(null);
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      const e = err as { messages?: string[] };
      setError(e.messages?.join(", ") ?? "Error al guardar");
    }
  };

  const handleEdit = (p: ProgramaAcademico) => {
    setEditing(p);
    setForm({
      nombre: p.nombre,
      codigo: p.codigo,
      facultad: p.facultad,
      duracionSemestres: p.duracionSemestres,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este programa?")) return;
    setError(null);
    try {
      await programasService.remove(id);
      notify("Programa eliminado");
      await load();
    } catch (err: unknown) {
      const e = err as { messages?: string[] };
      setError(e.messages?.join(", ") ?? "Error al eliminar");
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setError(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">🎓 Programas Académicos</h1>
          <p className="text-sm text-zinc-500 mt-1">Sprint 1 · HU-03</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors"
          >
            + Nuevo Programa
          </button>
        )}
      </div>

      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl"
        >
          <h2 className="font-semibold text-zinc-800 mb-4">
            {editing ? "Editar Programa" : "Nuevo Programa"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre</label>
              <input
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Código</label>
              <input
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Facultad</label>
              <input
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.facultad}
                onChange={(e) => setForm({ ...form, facultad: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Duración (semestres)
              </label>
              <input
                type="number"
                min={1}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.duracionSemestres}
                onChange={(e) =>
                  setForm({ ...form, duracionSemestres: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors"
            >
              {editing ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-zinc-500 text-sm">Cargando...</p>
      ) : programas.length === 0 ? (
        <p className="text-zinc-400 text-sm">No hay programas registrados.</p>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Código</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Facultad</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Semestres</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {programas.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">{p.nombre}</td>
                  <td className="px-4 py-3 text-zinc-600">{p.codigo}</td>
                  <td className="px-4 py-3 text-zinc-600">{p.facultad}</td>
                  <td className="px-4 py-3 text-zinc-600">{p.duracionSemestres}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-xs px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    >
                      Eliminar
                    </button>
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
