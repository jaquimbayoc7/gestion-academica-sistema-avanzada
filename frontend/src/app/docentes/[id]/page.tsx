"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { docentesService, Docente } from "@/services/docentes.service";
import { asignacionesService, AsignacionDocente } from "@/services/asignaciones.service";

export default function DocenteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [docente, setDocente] = useState<Docente | null>(null);
  const [asignaciones, setAsignaciones] = useState<AsignacionDocente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const numId = Number(id);
    if (!numId) { setError("ID inválido"); setLoading(false); return; }
    Promise.all([
      docentesService.findOne(numId),
      asignacionesService.findAll(),
    ])
      .then(([doc, asigs]) => {
        setDocente(doc);
        setAsignaciones(asigs.filter((a) => a.docenteId === numId));
      })
      .catch(() => setError("No se pudo cargar el docente"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-8 w-48 bg-zinc-200 rounded animate-pulse" />
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-3 flex gap-4">
              <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-zinc-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !docente) {
    return (
      <div className="p-8">
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
          ❌ {error ?? "Docente no encontrado"}
        </div>
        <button onClick={() => router.back()} className="text-sm text-zinc-500 hover:underline">
          ← Volver
        </button>
      </div>
    );
  }

  // Periodos únicos en los que tiene asignaciones
  const periodosUnicos = [...new Set(
    asignaciones.map((a) => a.periodoAcademico?.nombre).filter(Boolean)
  )];

  return (
    <div className="p-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-zinc-500 mb-6 flex items-center gap-1">
        <Link href="/docentes" className="hover:text-zinc-800 hover:underline">
          👨‍🏫 Docentes
        </Link>
        <span>/</span>
        <span className="text-zinc-800 font-medium">
          {docente.nombres} {docente.apellidos}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {docente.nombres} {docente.apellidos}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {docente.tituloProfesional} · {docente.especialidad}
          </p>
        </div>
        <Link
          href="/docentes"
          className="text-sm px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          ← Volver
        </Link>
      </div>

      {/* Datos de contacto */}
      <div className="bg-white border border-zinc-200 rounded-xl mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <h2 className="font-semibold text-zinc-800 text-sm">Datos del Docente</h2>
        </div>
        <dl className="divide-y divide-zinc-100 text-sm">
          {[
            ["Documento de Identidad", docente.documentoIdentidad],
            ["Correo Institucional", docente.correoInstitucional],
            ["Título Profesional", docente.tituloProfesional],
            ["Especialidad", docente.especialidad],
            ["Teléfono", docente.telefono ?? "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex px-6 py-3 gap-6">
              <dt className="w-44 shrink-0 text-zinc-500 font-medium">{label}</dt>
              <dd className="text-zinc-800">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Resumen */}
      {asignaciones.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 text-blue-700 rounded-xl p-4">
            <p className="text-2xl font-bold">{asignaciones.length}</p>
            <p className="text-xs font-medium mt-1">Asignaciones totales</p>
          </div>
          <div className="bg-green-50 text-green-700 rounded-xl p-4">
            <p className="text-2xl font-bold">{periodosUnicos.length}</p>
            <p className="text-xs font-medium mt-1">Períodos dictados</p>
          </div>
        </div>
      )}

      {/* Asignaciones */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <h2 className="font-semibold text-zinc-800 text-sm">
            Asignaciones de Asignaturas ({asignaciones.length})
          </h2>
        </div>
        {asignaciones.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-zinc-400 text-sm">
              Este docente no tiene asignaciones registradas.
            </p>
            <Link
              href="/asignaciones"
              className="inline-block mt-3 text-xs px-3 py-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              + Nueva asignación
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Asignatura</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Código</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Período Académico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {asignaciones.map((a) => (
                <tr key={a.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">
                    {a.asignatura?.nombre ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {a.asignatura?.codigo ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {a.periodoAcademico?.nombre ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
