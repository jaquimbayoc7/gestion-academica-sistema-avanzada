import { api } from "@/lib/api";

export interface Calificacion {
  id: number;
  matriculaId: number;
  nota1: number;
  nota2: number;
  nota3: number;
  notaDefinitiva: number;
}

export type CreateCalificacionDto = {
  matriculaId: number;
  nota1: number;
  nota2: number;
  nota3: number;
};

export type UpdateCalificacionDto = Partial<Omit<CreateCalificacionDto, "matriculaId">>;

export const calificacionesService = {
  findByMatricula: (matriculaId: number) =>
    api.get<Calificacion>(`/calificacion/${matriculaId}`),
  findByAsignacion: (asignacionId: number) =>
    api.get<Calificacion[]>(`/calificacion?asignacionId=${asignacionId}`),
  create: (data: CreateCalificacionDto) =>
    api.post<Calificacion>("/calificacion", data),
  update: (id: number, data: UpdateCalificacionDto) =>
    api.put<Calificacion>(`/calificacion/${id}`, data),
};
