import { api } from "@/lib/api";

export interface ProgramaAcademico {
  id: number;
  nombre: string;
  codigo: string;
  facultad: string;
  duracionSemestres: number;
}

export type CreateProgramaDto = Omit<ProgramaAcademico, "id">;
export type UpdateProgramaDto = Partial<CreateProgramaDto>;

export const programasService = {
  findAll: () => api.get<ProgramaAcademico[]>("/programa-academico"),
  findOne: (id: number) => api.get<ProgramaAcademico>(`/programa-academico/${id}`),
  create: (data: CreateProgramaDto) => api.post<ProgramaAcademico>("/programa-academico", data),
  update: (id: number, data: UpdateProgramaDto) => api.put<ProgramaAcademico>(`/programa-academico/${id}`, data),
  remove: (id: number) => api.delete<void>(`/programa-academico/${id}`),
};
