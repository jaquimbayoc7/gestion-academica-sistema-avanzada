"use client";

import { useEffect, useState } from "react";
import {
  calificacionesService,
  Calificacion,
  CreateCalificacionDto,
  UpdateCalificacionDto,
} from "@/services/calificaciones.service";
import { matriculasService, Matricula } from "@/services/matriculas.service";

type NoteForm = { nota1: string; nota2: string; nota3: string };
const emptyNotes: NoteForm = { nota1: "", nota2: "", nota3: "" };

type CalificacionWithRelations = Calificacion & {
  matricula?: {
    estudiante?: { nombres: string; apellidos: string };
    asignacionDocente?: { asignatura?: { nombre: string }; periodoAcademico?: { nombre: string } };
  };
};

function calcPreview(f: NoteForm): string {
  const n1 = parseFloat(f.nota1);
  const n2 = parseFloat(f.nota2);
  const n3 = parseFloat(f.nota3);
  if (isNaN(n1) || isNaN(n2) || isNaN(n3)) return "—";
  const def = Math.round((n1 * 0.3 + n2 * 0.3 + n3 * 0.4) * 100) / 100;
  return def.toFixed(2);
}

export default function CalificacionesPage() {
  const [calificaciones, setCalificaciones] = useState<CalificacionWithRelations[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Calificacion | null>(null);
  const [selectedMatricula, setSelectedMatricula] = useState<number>(0);
  const [notes, setNotes] = useState<NoteForm>(emptyNotes);

  const load = async () => {
    try {
      const [c, m] = await Promise.all([
        calificacionesService.findAll(),
        matriculasService.findAll(),
      ]);
      setCalificaciones(c); setMatriculas(m);
    } catch { setError("Error al cargar los datos"); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const notify = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const n1 = parseFloat(notes.nota1), n2 = parseFloat(notes.nota2), n3 = parseFloat(notes.nota3);
    if ([n1, n2, n3].some((n) => isNaN(n) || n < 0 || n > 5)) {
      setError("Las notas deben ser un número entre 0.0 y 5.0"); return;
    }
    try {
      if (editing) {
        const dto: UpdateCalificacionDto = { nota1: n1, nota2: n2, nota3: n3 };
        await calificacionesService.update(editing.id, dto);
        notify("Calificación actualizada");
      } else {
        const dto: CreateCalificacionDto = { matriculaId: selectedMatricula, nota1: n1, nota2: n2, nota3: n3 };
        await calificacionesService.create(dto);
        notify("Calificación registrada");
      }
      setNotes(emptyNotes); setSelectedMatricula(0); setEditing(null); setShowForm(false); await load();
    } catch (err: unknown) { const e = err as { messages?: string[] }; setError(e.messages?.join(", ") ?? "Error al guardar"); }
  };

  const handleEdit = (c: Calificacion) => {
    setEditing(c); setNotes({ nota1: String(c.nota1), nota2: String(c.nota2), nota3: String(c.nota3) });
    setShowForm(true);
  };

  const matriculasSinNota = matriculas.filter((m) => !calificaciones.some((c) => c.matriculaId === m.id));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">⭐ Calificaciones</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Sprint 3 · HU-08 · Definitiva = Nota1×30% + Nota2×30% + Nota3×40%
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">
            + Registrar Calificación
          </button>
        )}
      </div>

      {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>}
      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl">
          <h2 className="font-semibold text-zinc-800 mb-4">
            {editing ? "Editar Calificación" : "Registrar Calificación"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!editing && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Matrícula</label>
                <select
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={selectedMatricula}
                  onChange={(e) => setSelectedMatricula(Number(e.target.value))}
                  required
                >
                  <option value={0} disabled>Seleccionar matrícula...</option>
                  {matriculasSinNota.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.estudiante ? `${m.estudiante.nombres} ${m.estudiante.apellidos}` : `Matrícula #${m.id}`}
                      {m.asignacionDocente?.asignatura ? ` — ${m.asignacionDocente.asignatura.nombre}` : ""}
                      {m.asignacionDocente?.periodoAcademico ? ` (${m.asignacionDocente.periodoAcademico.nombre})` : ""}
                    </option>
                  ))}
                </select>
                {matriculasSinNota.length === 0 && (
                  <p className="text-xs text-zinc-400 mt-1">Todas las matrículas ya tienen calificaciones registradas.</p>
                )}
              </div>
            )}
            {(["nota1", "nota2", "nota3"] as const).map((field, i) => (
              <div key={field}>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Nota {i + 1} {i === 0 || i === 1 ? "(30%)" : "(40%)"}
                </label>
                <input
                  type="number" step="0.1" min="0" max="5"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={notes[field]}
                  onChange={(e) => setNotes({ ...notes, [field]: e.target.value })}
                  placeholder="0.0 - 5.0"
                  required
                />
              </div>
            ))}
            <div className="flex items-end">
              <div className="w-full p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <p className="text-xs text-zinc-500 mb-1">Nota Definitiva (calculada)</p>
                <p className={`text-2xl font-bold ${
                  parseFloat(calcPreview(notes)) >= 3.0 ? "text-green-600" : 
                  calcPreview(notes) === "—" ? "text-zinc-400" : "text-red-600"
                }`}>
                  {calcPreview(notes)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">
              {editing ? "Actualizar" : "Registrar"}
            </button>
            <button type="button" onClick={() => { setNotes(emptyNotes); setSelectedMatricula(0); setEditing(null); setShowForm(false); setError(null); }} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? <p className="text-zinc-500 text-sm">Cargando...</p> : calificaciones.length === 0 ? (
        <p className="text-zinc-400 text-sm">No hay calificaciones registradas.</p>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Estudiante</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nota 1 (30%)</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nota 2 (30%)</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nota 3 (40%)</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Definitiva</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {calificaciones.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">
                    {c.matricula?.estudiante
                      ? `${c.matricula.estudiante.nombres} ${c.matricula.estudiante.apellidos}`
                      : `Matrícula #${c.matriculaId}`}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{c.nota1.toFixed(1)}</td>
                  <td className="px-4 py-3 text-zinc-600">{c.nota2.toFixed(1)}</td>
                  <td className="px-4 py-3 text-zinc-600">{c.nota3.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${c.notaDefinitiva >= 3.0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.notaDefinitiva.toFixed(2)} {c.notaDefinitiva >= 3.0 ? "✅" : "❌"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(c)} className="text-xs px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors">Editar</button>
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
