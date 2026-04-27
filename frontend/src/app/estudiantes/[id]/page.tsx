"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  estudiantesService,
  Estudiante,
} from "@/services/estudiantes.service";
import {
  matriculasService,
  Matricula,
} from "@/services/matriculas.service";

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-zinc-200 rounded animate-pulse w-full" />
        </td>
      ))}
    </tr>
  );
}

export default function EstudianteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const numId = Number(id);
    if (!numId) { setError("ID inválido"); setLoading(false); return; }
    Promise.all([
      estudiantesService.findOne(numId),
      matriculasService.findAll(),
    ])
      .then(([est, mats]) => {
        setEstudiante(est);
        setMatriculas(mats.filter((m) => m.estudianteId === numId));
      })
      .catch(() => setError("No se pudo cargar el estudiante"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-8 w-48 bg-zinc-200 rounded animate-pulse" />
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="mb-3 flex gap-4">
              <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-zinc-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !estudiante) {
    return (
      <div className="p-8">
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
          ❌ {error ?? "Estudiante no encontrado"}
        </div>
        <button onClick={() => router.back()} className="text-sm text-zinc-500 hover:underline">
          ← Volver
        </button>
      </div>
    );
  }

  const aprobadas = matriculas.filter(
    (m) => m.calificacion && m.calificacion.notaDefinitiva >= 3.0
  ).length;
  const reprobadas = matriculas.filter(
    (m) => m.calificacion && m.calificacion.notaDefinitiva < 3.0
  ).length;

  return (
    <div className="p-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-zinc-500 mb-6 flex items-center gap-1">
        <Link href="/estudiantes" className="hover:text-zinc-800 hover:underline">
          👤 Estudiantes
        </Link>
        <span>/</span>
        <span className="text-zinc-800 font-medium">
          {estudiante.nombres} {estudiante.apellidos}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {estudiante.nombres} {estudiante.apellidos}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {estudiante.codigoEstudiantil} · {estudiante.programaAcademico?.nombre ?? "—"}
          </p>
        </div>
        <Link
          href="/estudiantes"
          className="text-sm px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          ← Volver
        </Link>
      </div>

      {/* Datos personales */}
      <div className="bg-white border border-zinc-200 rounded-xl mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <h2 className="font-semibold text-zinc-800 text-sm">Datos Personales</h2>
        </div>
        <dl className="divide-y divide-zinc-100 text-sm">
          {[
            ["Documento de Identidad", estudiante.documentoIdentidad],
            ["Correo Institucional", estudiante.correoInstitucional],
            [
              "Fecha de Nacimiento",
              new Date(estudiante.fechaNacimiento).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            ],
            ["Programa Académico", estudiante.programaAcademico?.nombre ?? "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex px-6 py-3 gap-6">
              <dt className="w-44 shrink-0 text-zinc-500 font-medium">{label}</dt>
              <dd className="text-zinc-800">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Resumen académico */}
      {matriculas.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Matrículas", value: matriculas.length, color: "bg-blue-50 text-blue-700" },
            { label: "Aprobadas", value: aprobadas, color: "bg-green-50 text-green-700" },
            { label: "Reprobadas", value: reprobadas, color: "bg-red-50 text-red-700" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Historial de matrículas */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <h2 className="font-semibold text-zinc-800 text-sm">
            Historial de Matrículas ({matriculas.length})
          </h2>
        </div>
        {matriculas.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-zinc-400 text-sm">Este estudiante no tiene matrículas registradas.</p>
            <Link
              href="/matriculas"
              className="inline-block mt-3 text-xs px-3 py-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              + Registrar matrícula
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Asignatura</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Período</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Fecha Inscripción</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nota Definitiva</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {matriculas.map((m) => {
                const nota = m.calificacion?.notaDefinitiva;
                const aprobado = nota !== undefined && nota >= 3.0;
                return (
                  <tr key={m.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-800">
                      {m.asignacionDocente?.asignatura?.nombre ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {m.asignacionDocente?.periodoAcademico?.nombre ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(m.fechaInscripcion).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-4 py-3">
                      {nota !== undefined ? (
                        <span
                          className={`font-bold ${aprobado ? "text-green-600" : "text-red-600"}`}
                        >
                          {nota.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic">Pendiente</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {nota !== undefined ? (
                        <span
                          className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                            aprobado
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {aprobado ? "Aprobado" : "Reprobado"}
                        </span>
                      ) : (
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                          Sin nota
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
