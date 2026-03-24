import { api } from "@/lib/api";

export interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  codigoEstudiantil: string;
  documentoIdentidad: string;
  correoInstitucional: string;
  fechaNacimiento: string;
  programaAcademicoId: number;
  programaAcademico?: { id: number; nombre: string };
}

export type CreateEstudianteDto = Omit<Estudiante, "id" | "programaAcademico">;
export type UpdateEstudianteDto = Partial<CreateEstudianteDto>;

export const estudiantesService = {
  findAll: () => api.get<Estudiante[]>("/estudiante"),
  findOne: (id: number) => api.get<Estudiante>(`/estudiante/${id}`),
  create: (data: CreateEstudianteDto) => api.post<Estudiante>("/estudiante", data),
  update: (id: number, data: UpdateEstudianteDto) => api.put<Estudiante>(`/estudiante/${id}`, data),
  remove: (id: number) => api.delete<void>(`/estudiante/${id}`),
};
