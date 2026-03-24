import { api } from "@/lib/api";

export interface PeriodoAcademico {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export type CreatePeriodoDto = Omit<PeriodoAcademico, "id">;
export type UpdatePeriodoDto = Partial<CreatePeriodoDto>;

export const periodosService = {
  findAll: () => api.get<PeriodoAcademico[]>("/periodo-academico"),
  findOne: (id: number) => api.get<PeriodoAcademico>(`/periodo-academico/${id}`),
  create: (data: CreatePeriodoDto) => api.post<PeriodoAcademico>("/periodo-academico", data),
  update: (id: number, data: UpdatePeriodoDto) => api.put<PeriodoAcademico>(`/periodo-academico/${id}`, data),
  remove: (id: number) => api.delete<void>(`/periodo-academico/${id}`),
};
