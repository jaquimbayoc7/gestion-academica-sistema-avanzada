import Link from "next/link";

const modules = [
  {
    href: "/programas",
    title: "Programas Académicos",
    description: "Gestiona los programas de la institución",
    icon: "🎓",
    sprint: "Sprint 1",
  },
  {
    href: "/estudiantes",
    title: "Estudiantes",
    description: "Registro y consulta de estudiantes",
    icon: "👤",
    sprint: "Sprint 1",
  },
  {
    href: "/docentes",
    title: "Docentes",
    description: "Gestión del cuerpo docente",
    icon: "👨‍🏫",
    sprint: "Sprint 1",
  },
  {
    href: "/asignaturas",
    title: "Asignaturas",
    description: "Catálogo de asignaturas por programa",
    icon: "📚",
    sprint: "Sprint 2",
  },
  {
    href: "/periodos",
    title: "Períodos Académicos",
    description: "Control de períodos activos e inactivos",
    icon: "📅",
    sprint: "Sprint 2",
  },
  {
    href: "/asignaciones",
    title: "Asignaciones Docente",
    description: "Asignación de docentes a asignaturas por período",
    icon: "🔗",
    sprint: "Sprint 2",
  },
  {
    href: "/matriculas",
    title: "Matrículas",
    description: "Inscripción de estudiantes en asignaturas",
    icon: "📝",
    sprint: "Sprint 3",
  },
  {
    href: "/calificaciones",
    title: "Calificaciones",
    description: "Registro y cálculo automático de notas",
    icon: "⭐",
    sprint: "Sprint 3",
  },
];

const sprintColors: Record<string, string> = {
  "Sprint 1": "bg-blue-100 text-blue-700",
  "Sprint 2": "bg-green-100 text-green-700",
  "Sprint 3": "bg-purple-100 text-purple-700",
};

export default function HomePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          🎓 Sistema de Gestión Académica
        </h1>
        <p className="text-zinc-500 mt-2">
          Programación Avanzada 2026A — CORHUILA · Release 1 (Sprint 3)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="block p-5 bg-white rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{mod.icon}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${sprintColors[mod.sprint]}`}
              >
                {mod.sprint}
              </span>
            </div>
            <h2 className="font-semibold text-zinc-800 group-hover:text-zinc-900 mb-1">
              {mod.title}
            </h2>
            <p className="text-sm text-zinc-500">{mod.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

