"use client";

import { useEffect, useState } from "react";
import {
  estudiantesService,
  Estudiante,
  CreateEstudianteDto,
} from "@/services/estudiantes.service";
import { programasService, ProgramaAcademico } from "@/services/programas.service";

const emptyForm: CreateEstudianteDto = {
  nombres: "",
  apellidos: "",
  codigoEstudiantil: "",
  documentoIdentidad: "",
  correoInstitucional: "",
  fechaNacimiento: "",
  programaAcademicoId: 0,
};

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [programas, setProgramas] = useState<ProgramaAcademico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Estudiante | null>(null);
  const [form, setForm] = useState<CreateEstudianteDto>(emptyForm);

  const load = async () => {
    try {
      const [est, prog] = await Promise.all([
        estudiantesService.findAll(),
        programasService.findAll(),
      ]);
      setEstudiantes(est);
      setProgramas(prog);
    } catch {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing) {
        await estudiantesService.update(editing.id, form);
        notify("Estudiante actualizado correctamente");
      } else {
        await estudiantesService.create(form);
        notify("Estudiante creado correctamente");
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

  const handleEdit = (est: Estudiante) => {
    setEditing(est);
    setForm({
      nombres: est.nombres,
      apellidos: est.apellidos,
      codigoEstudiantil: est.codigoEstudiantil,
      documentoIdentidad: est.documentoIdentidad,
      correoInstitucional: est.correoInstitucional,
      fechaNacimiento: est.fechaNacimiento.split("T")[0],
      programaAcademicoId: est.programaAcademicoId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este estudiante?")) return;
    setError(null);
    try {
      await estudiantesService.remove(id);
      notify("Estudiante eliminado");
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

  const f = (field: keyof CreateEstudianteDto) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [field]: field === "programaAcademicoId" ? Number(e.target.value) : e.target.value });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">👤 Estudiantes</h1>
          <p className="text-sm text-zinc-500 mt-1">Sprint 1 · HU-01</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors"
          >
            + Nuevo Estudiante
          </button>
        )}
      </div>

      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl">
          <h2 className="font-semibold text-zinc-800 mb-4">{editing ? "Editar Estudiante" : "Nuevo Estudiante"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Nombres", field: "nombres" as const },
              { label: "Apellidos", field: "apellidos" as const },
              { label: "Código Estudiantil", field: "codigoEstudiantil" as const },
              { label: "Documento de Identidad", field: "documentoIdentidad" as const },
              { label: "Correo Institucional", field: "correoInstitucional" as const, type: "email" },
              { label: "Fecha de Nacimiento", field: "fechaNacimiento" as const, type: "date" },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-zinc-700 mb-1">{label}</label>
                <input
                  type={type ?? "text"}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={String(form[field])}
                  onChange={f(field)}
                  required
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Programa Académico</label>
              <select
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.programaAcademicoId}
                onChange={f("programaAcademicoId")}
                required
              >
                <option value={0} disabled>Seleccionar...</option>
                {programas.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">
              {editing ? "Actualizar" : "Crear"}
            </button>
            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-zinc-500 text-sm">Cargando...</p>
      ) : estudiantes.length === 0 ? (
        <p className="text-zinc-400 text-sm">No hay estudiantes registrados.</p>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Código</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Correo</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Programa</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {estudiantes.map((est) => (
                <tr key={est.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">{est.nombres} {est.apellidos}</td>
                  <td className="px-4 py-3 text-zinc-600">{est.codigoEstudiantil}</td>
                  <td className="px-4 py-3 text-zinc-600">{est.correoInstitucional}</td>
                  <td className="px-4 py-3 text-zinc-600">{est.programaAcademico?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(est)} className="text-xs px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(est.id)} className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors">Eliminar</button>
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
