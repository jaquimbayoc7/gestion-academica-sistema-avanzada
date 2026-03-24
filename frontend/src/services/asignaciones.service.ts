import { api } from "@/lib/api";

export interface AsignacionDocente {
  id: number;
  docenteId: number;
  asignaturaId: number;
  periodoAcademicoId: number;
  docente?: { id: number; nombres: string; apellidos: string };
  asignatura?: { id: number; nombre: string; codigo: string };
  periodoAcademico?: { id: number; nombre: string };
}

export type CreateAsignacionDto = Omit<
  AsignacionDocente,
  "id" | "docente" | "asignatura" | "periodoAcademico"
>;

export const asignacionesService = {
  findAll: (periodoId?: number) =>
    api.get<AsignacionDocente[]>(
      periodoId ? `/asignacion-docente?periodoId=${periodoId}` : "/asignacion-docente"
    ),
  findOne: (id: number) => api.get<AsignacionDocente>(`/asignacion-docente/${id}`),
  create: (data: CreateAsignacionDto) =>
    api.post<AsignacionDocente>("/asignacion-docente", data),
  remove: (id: number) => api.delete<void>(`/asignacion-docente/${id}`),
};
