"use client";

import { useEffect, useState } from "react";
import {
  docentesService,
  Docente,
  CreateDocenteDto,
} from "@/services/docentes.service";

const emptyForm: CreateDocenteDto = {
  nombres: "",
  apellidos: "",
  documentoIdentidad: "",
  tituloProfesional: "",
  especialidad: "",
  correoInstitucional: "",
  telefono: "",
};

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Docente | null>(null);
  const [form, setForm] = useState<CreateDocenteDto>(emptyForm);

  const load = async () => {
    try {
      setDocentes(await docentesService.findAll());
    } catch {
      setError("Error al cargar los docentes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      if (editing) {
        await docentesService.update(editing.id, form);
        notify("Docente actualizado");
      } else {
        await docentesService.create(form);
        notify("Docente creado");
      }
      setForm(emptyForm); setEditing(null); setShowForm(false); await load();
    } catch (err: unknown) {
      const e = err as { messages?: string[] };
      setError(e.messages?.join(", ") ?? "Error al guardar");
    }
  };

  const handleEdit = (d: Docente) => {
    setEditing(d);
    setForm({ nombres: d.nombres, apellidos: d.apellidos, documentoIdentidad: d.documentoIdentidad, tituloProfesional: d.tituloProfesional, especialidad: d.especialidad, correoInstitucional: d.correoInstitucional, telefono: d.telefono ?? "" });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este docente?")) return; setError(null);
    try { await docentesService.remove(id); notify("Docente eliminado"); await load(); }
    catch (err: unknown) { const e = err as { messages?: string[] }; setError(e.messages?.join(", ") ?? "Error al eliminar"); }
  };

  const handleCancel = () => { setForm(emptyForm); setEditing(null); setShowForm(false); setError(null); };
  const f = (field: keyof CreateDocenteDto) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">👨‍🏫 Docentes</h1>
          <p className="text-sm text-zinc-500 mt-1">Sprint 1 · HU-02</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">
            + Nuevo Docente
          </button>
        )}
      </div>

      {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>}
      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl">
          <h2 className="font-semibold text-zinc-800 mb-4">{editing ? "Editar Docente" : "Nuevo Docente"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Nombres", field: "nombres" as const },
              { label: "Apellidos", field: "apellidos" as const },
              { label: "Documento de Identidad", field: "documentoIdentidad" as const },
              { label: "Título Profesional", field: "tituloProfesional" as const },
              { label: "Especialidad", field: "especialidad" as const },
              { label: "Correo Institucional", field: "correoInstitucional" as const, type: "email" },
              { label: "Teléfono (opcional)", field: "telefono" as const },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-zinc-700 mb-1">{label}</label>
                <input
                  type={type ?? "text"}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={String(form[field] ?? "")}
                  onChange={f(field)}
                  required={field !== "telefono"}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">{editing ? "Actualizar" : "Crear"}</button>
            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? <p className="text-zinc-500 text-sm">Cargando...</p> : docentes.length === 0 ? (
        <p className="text-zinc-400 text-sm">No hay docentes registrados.</p>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Documento</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Especialidad</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Correo</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {docentes.map((d) => (
                <tr key={d.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">{d.nombres} {d.apellidos}</td>
                  <td className="px-4 py-3 text-zinc-600">{d.documentoIdentidad}</td>
                  <td className="px-4 py-3 text-zinc-600">{d.especialidad}</td>
                  <td className="px-4 py-3 text-zinc-600">{d.correoInstitucional}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(d)} className="text-xs px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(d.id)} className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors">Eliminar</button>
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
