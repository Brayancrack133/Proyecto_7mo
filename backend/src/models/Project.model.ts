import { db } from "../config/db.js";
import type { 
  Project, 
  ProjectCreate, 
  ProjectUpdate, 
  ProjectWithDetails,
  ProjectStatus 
} from "../types/project.types.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export class ProjectModel {

  // ============================================================
  // 🔹 OBTENER TODOS LOS PROYECTOS
  // ============================================================
  static async getAll(): Promise<Project[]> {
    const query = `
      SELECT 
        p.id_proyecto,
        p.nombre,
        p.descripcion,
        p.fecha_inicio,
        p.fecha_fin,
        p.id_jefe,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre_jefe,
        ep.nombre_estado AS estado_actual,
        peh.id_estado_proyecto,
        COUNT(DISTINCT t.id_tarea) AS cantidad_tareas
      FROM Proyectos p
      LEFT JOIN Usuarios u ON p.id_jefe = u.id_usuario
      LEFT JOIN (
        SELECT id_proyecto, id_estado_proyecto, fecha_cambio
        FROM Proyecto_Estado_Historico peh1
        WHERE fecha_cambio = (
          SELECT MAX(fecha_cambio)
          FROM Proyecto_Estado_Historico peh2
          WHERE peh2.id_proyecto = peh1.id_proyecto
        )
      ) peh ON p.id_proyecto = peh.id_proyecto
      LEFT JOIN Estados_Proyecto ep ON peh.id_estado_proyecto = ep.id_estado_proyecto
      LEFT JOIN Tareas t ON p.id_proyecto = t.id_proyecto
      GROUP BY p.id_proyecto
      ORDER BY p.fecha_inicio DESC
    `;

    const [rows] = await db.query<RowDataPacket[]>(query);
    return rows as Project[];
  }

  // ============================================================
  // 🔹 OBTENER PROYECTO POR ID
  // ============================================================
  static async getById(id: number): Promise<ProjectWithDetails | null> {
    const projectQuery = `
      SELECT 
        p.*,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre_jefe,
        u.correo AS correo_jefe,
        ep.nombre_estado AS estado_actual,
        peh.id_estado_proyecto
      FROM Proyectos p
      LEFT JOIN Usuarios u ON p.id_jefe = u.id_usuario
      LEFT JOIN (
        SELECT id_proyecto, id_estado_proyecto, fecha_cambio
        FROM Proyecto_Estado_Historico peh1
        WHERE fecha_cambio = (
          SELECT MAX(fecha_cambio)
          FROM Proyecto_Estado_Historico peh2
          WHERE peh2.id_proyecto = peh1.id_proyecto
        )
      ) peh ON p.id_proyecto = peh.id_proyecto
      LEFT JOIN Estados_Proyecto ep ON peh.id_estado_proyecto = ep.id_estado_proyecto
      WHERE p.id_proyecto = ?
    `;

    const [rows] = await db.query<RowDataPacket[]>(projectQuery, [id]);
    if (rows.length === 0) return null;

    const project = rows[0] as ProjectWithDetails;

    // ========== EQUIPO ==========
    const teamQuery = `
      SELECT 
        me.id_miembro,
        me.id_usuario,
        me.rol_en_equipo,
        u.nombre,
        u.apellido,
        u.correo
      FROM Miembros_Equipo me
      INNER JOIN Usuarios u ON me.id_usuario = u.id_usuario
      INNER JOIN Equipos e ON me.id_equipo = e.id_equipo
      WHERE e.id_equipo = (
        SELECT id_equipo 
        FROM Equipos 
        WHERE nombre_equipo LIKE CONCAT('%', ?, '%') 
        LIMIT 1
      )
    `;

    const [teamRows] = await db.query<RowDataPacket[]>(teamQuery, [project.nombre]);
    project.equipo = teamRows as any;

    // ========== TAREAS ==========
    const tasksQuery = `
      SELECT 
        t.*,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre_responsable,
        pr.nombre_prioridad AS prioridad_actual
      FROM Tareas t
      LEFT JOIN Usuarios u ON t.id_responsable = u.id_usuario
      LEFT JOIN (
        SELECT id_tarea, id_prioridad
        FROM Tarea_Prioridad_Historico tph1
        WHERE fecha_asignacion = (
          SELECT MAX(fecha_asignacion)
          FROM Tarea_Prioridad_Historico tph2
          WHERE tph2.id_tarea = tph1.id_tarea
        )
      ) tph ON t.id_tarea = tph.id_tarea
      LEFT JOIN Prioridades pr ON tph.id_prioridad = pr.id_prioridad
      WHERE t.id_proyecto = ?
      ORDER BY t.fecha_inicio DESC
    `;

    const [tasksRows] = await db.query<RowDataPacket[]>(tasksQuery, [id]);
    project.tareas = tasksRows as any;

    return project;
  }

  // ============================================================
  // 🔹 CREAR PROYECTO CON TRANSACCIÓN
  // ============================================================
  static async create(data: ProjectCreate): Promise<Project> {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // INSERT
      const insertQuery = `
        INSERT INTO Proyectos (nombre, descripcion, fecha_inicio, fecha_fin, id_jefe)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await connection.query<ResultSetHeader>(insertQuery, [
        data.nombre,
        data.descripcion || null,
        data.fecha_inicio,
        data.fecha_fin || null,
        data.id_jefe,
      ]);

      const projectId = result.insertId;

      // ESTADO INICIAL
      const estadoId = data.id_estado_proyecto || 1;

      await connection.query(
        `INSERT INTO Proyecto_Estado_Historico (id_proyecto, id_estado_proyecto) VALUES (?, ?)`,
        [projectId, estadoId]
      );

      // EQUIPO
      await connection.query(
        `INSERT INTO Equipos (nombre_equipo) VALUES (?)`,
        [`Equipo ${data.nombre}`]
      );

      const [equipoRows] = await connection.query<RowDataPacket[]>(
        `SELECT LAST_INSERT_ID() AS id_equipo`
      );

      const equipoId = (equipoRows[0] as any).id_equipo;

      // LÍDER DEL EQUIPO
      await connection.query(
        `INSERT INTO Miembros_Equipo (id_equipo, id_usuario, rol_en_equipo)
         VALUES (?, ?, 'Jefe de Proyecto')`,
        [equipoId, data.id_jefe]
      );

      await connection.commit();

      return (await this.getById(projectId)) as Project;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // ============================================================
  // 🔹 ACTUALIZAR PROYECTO
  // ============================================================
  static async update(id: number, data: ProjectUpdate): Promise<Project | null> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const fields: string[] = [];
const values: any[] = [];

const keys: (keyof ProjectUpdate)[] = [
  "nombre",
  "descripcion",
  "fecha_inicio",
  "fecha_fin",
  "id_jefe"
];

for (const key of keys) {
  if (data[key] !== undefined) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }
}
      if (fields.length > 0) {
        values.push(id);
        await connection.query(
          `UPDATE Proyectos SET ${fields.join(", ")} WHERE id_proyecto = ?`,
          values
        );
      }

      await connection.commit();
      return this.getById(id);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // ============================================================
  // 🔹 ELIMINAR PROYECTO
  // ============================================================
  static async delete(id: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.query<ResultSetHeader>(
        `DELETE FROM Proyectos WHERE id_proyecto = ?`,
        [id]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // ============================================================
  // 🔹 ESTADOS
  // ============================================================
  static async getAllStatuses(): Promise<ProjectStatus[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM Estados_Proyecto ORDER BY id_estado_proyecto`
    );
    return rows as ProjectStatus[];
  }

  // ============================================================
  // 🔹 ESTADÍSTICAS
  // ============================================================
  static async getStatistics(projectId: number) {
    const query = `
      SELECT 
        COUNT(DISTINCT t.id_tarea) AS total_tareas,
        COUNT(DISTINCT CASE WHEN t.fecha_fin < NOW() THEN t.id_tarea END) AS tareas_vencidas,
        COUNT(DISTINCT me.id_usuario) AS total_miembros,
        COUNT(DISTINCT d.id_doc) AS total_documentos
      FROM Proyectos p
      LEFT JOIN Tareas t ON p.id_proyecto = t.id_proyecto
      LEFT JOIN Equipos e ON e.nombre_equipo LIKE CONCAT('%', p.nombre, '%')
      LEFT JOIN Miembros_Equipo me ON e.id_equipo = me.id_equipo
      LEFT JOIN Documentos d ON p.id_proyecto = d.id_proyecto
      WHERE p.id_proyecto = ?
      GROUP BY p.id_proyecto
    `;

    const [rows] = await db.query<RowDataPacket[]>(query, [projectId]);
    return rows[0] || {};
  }
}
