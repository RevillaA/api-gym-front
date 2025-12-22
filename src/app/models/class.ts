export interface Class {
  id_clase?: number;
  nombre_clase: string;
  descripcion?: string;
  horario: string; // HH:MM
  dia_semana: string; // ej: 'Lunes'
  id_entrenador?: number;
  entrenador_nombre?: string;
  entrenador_apellido?: string;
}