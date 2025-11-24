export interface Document {
  id_doc: number;
  id_proyecto: number;
  nombre_archivo: string;
  url: string;
  id_tipo_doc: number;
  id_usuario_subida: number;
  fecha_subida: Date;
}