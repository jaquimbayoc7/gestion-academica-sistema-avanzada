import { api } from "@/lib/api";

export interface Matricula {
  id: number;
  estudianteId: number;
  asignacionDocenteId: number;
  fechaInscripcion: string;
  estudiante?: { id: number; nombres: string; apellidos: string };
  asignacionDocente?: {
    id: number;
    asignatura?: { nombre: string };
    periodoAcademico?: { nombre: string };
  };
  calificacion?: { notaDefinitiva: number };
}

export type CreateMatriculaDto = {
  estudianteId: number;
  asignacionDocenteId: number;
};

export const matriculasService = {
  findAll: () => api.get<Matricula[]>("/matricula"),
  findByEstudiante: (estudianteId: number) =>
    api.get<Matricula[]>(`/matricula?estudianteId=${estudianteId}`),
  findOne: (id: number) => api.get<Matricula>(`/matricula/${id}`),
  create: (data: CreateMatriculaDto) => api.post<Matricula>("/matricula", data),
  remove: (id: number) => api.delete<void>(`/matricula/${id}`),
};
