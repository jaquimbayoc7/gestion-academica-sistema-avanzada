import { api } from "@/lib/api";

export interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  programaAcademicoId: number;
  programaAcademico?: { id: number; nombre: string };
}

export type CreateAsignaturaDto = Omit<Asignatura, "id" | "programaAcademico">;
export type UpdateAsignaturaDto = Partial<CreateAsignaturaDto>;

export const asignaturasService = {
  findAll: (programaId?: number) =>
    api.get<Asignatura[]>(programaId ? `/asignatura?programaId=${programaId}` : "/asignatura"),
  findOne: (id: number) => api.get<Asignatura>(`/asignatura/${id}`),
  create: (data: CreateAsignaturaDto) => api.post<Asignatura>("/asignatura", data),
  update: (id: number, data: UpdateAsignaturaDto) => api.put<Asignatura>(`/asignatura/${id}`, data),
  remove: (id: number) => api.delete<void>(`/asignatura/${id}`),
};
