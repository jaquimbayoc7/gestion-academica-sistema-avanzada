import { api } from "@/lib/api";

export interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  documentoIdentidad: string;
  tituloProfesional: string;
  especialidad: string;
  correoInstitucional: string;
  telefono?: string;
}

export type CreateDocenteDto = Omit<Docente, "id">;
export type UpdateDocenteDto = Partial<CreateDocenteDto>;

export const docentesService = {
  findAll: () => api.get<Docente[]>("/docente"),
  findOne: (id: number) => api.get<Docente>(`/docente/${id}`),
  create: (data: CreateDocenteDto) => api.post<Docente>("/docente", data),
  update: (id: number, data: UpdateDocenteDto) => api.put<Docente>(`/docente/${id}`, data),
  remove: (id: number) => api.delete<void>(`/docente/${id}`),
};
