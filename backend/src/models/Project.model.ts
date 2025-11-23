import pool from '../config/db.js';
import type { 
  Project, 
  ProjectCreate, 
  ProjectUpdate, 
  ProjectWithDetails,
  ProjectStatus 
} from '../types/project.types.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export class ProjectModel {

  // ==================== CRUD BÁSICO ====================

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

    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows as Project[];
  }

  // ==================== OBTENER POR ID ====================

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

    const [projectRows] = await pool.query<RowDataPacket[]>(projectQuery, [id]);

    if (projectRows.length === 0) return null;

    const project = projectRows[0] as ProjectWithDetails;

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
        SELECT id_equipo FROM Equipos WHERE nombre_equipo LIKE CONCAT('%', ?, '%') LIMIT 1
      )
    `;

    const [teamRows] = await pool.query<RowDataPacket[]>(teamQuery, [project.nombre]);
    project.equipo = teamRows as any;

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

    const [tasksRows] = await pool.query<RowDataPacket[]>(tasksQuery, [id]);
    project.tareas = tasksRows as any;

    return project;
  }

  // ==================== CREAR ====================

  static async create(data: ProjectCreate): Promise<Project> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const insertQuery = `
        INSERT INTO Proyectos (nombre, descripcion, fecha_inicio, fecha_fin, id_jefe)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await connection.query<ResultSetHeader>(insertQuery, [
        data.nombre,
        data.descripcion || null,
        data.fecha_inicio,
        data.fecha_fin || null,
        data.id_jefe
      ]);

      const projectId = result.insertId;

      await connection.query(
        'INSERT INTO Proyecto_Estado_Historico (id_proyecto, id_estado_proyecto) VALUES (?, ?)',
        [projectId, data.id_estado_proyecto || 1]
      );

      await connection.query(
        'INSERT INTO Equipos (nombre_equipo) VALUES (?)',
        [`Equipo ${data.nombre}`]
      );

      const [equipoRows] = await connection.query<RowDataPacket[]>(
        'SELECT LAST_INSERT_ID() AS id_equipo'
      );

      const equipoId = (equipoRows[0] as { id_equipo: number }).id_equipo;

      await connection.query(
        'INSERT INTO Miembros_Equipo (id_equipo, id_usuario, rol_en_equipo) VALUES (?, ?, ?)',
        [equipoId, data.id_jefe, 'Jefe de Proyecto']
      );

      await connection.query(
        `INSERT INTO Logs_Auditoria (id_usuario, accion, tabla_afectada, registro_id, detalles)
         VALUES (?, 'CREATE_PROYECTO', 'Proyectos', ?, ?)`,
        [data.id_jefe, projectId, JSON.stringify(data)]
      );

      await connection.commit();

      const project = await this.getById(projectId);
      return project as Project;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // ==================== ACTUALIZAR ====================

  static async update(id: number, data: ProjectUpdate, userId: number): Promise<Project | null> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const fields: string[] = [];
      const values: any[] = [];

      for (const key of Object.keys(data)) {
        const value = data[key as keyof ProjectUpdate];
        if (value !== undefined) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (fields.length === 0) {
        await connection.rollback();
        return await this.getById(id);
      }

      values.push(id);

      await connection.query(
        `UPDATE Proyectos SET ${fields.join(', ')} WHERE id_proyecto = ?`,
        values
      );

      await connection.query(
        `INSERT INTO Logs_Auditoria (id_usuario, accion, tabla_afectada, registro_id, detalles)
         VALUES (?, 'UPDATE_PROYECTO', 'Proyectos', ?, ?)`,
        [userId, id, JSON.stringify(data)]
      );

      await connection.commit();

      return await this.getById(id);

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // ==================== ELIMINAR ====================

  static async delete(id: number, userId: number): Promise<boolean> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [projectRows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM Proyectos WHERE id_proyecto = ?',
        [id]
      );

      if (projectRows.length === 0) {
        await connection.rollback();
        return false;
      }

      await connection.query(
        `INSERT INTO Logs_Auditoria (id_usuario, accion, tabla_afectada, registro_id, detalles)
         VALUES (?, 'DELETE_PROYECTO', 'Proyectos', ?, ?)`,
        [userId, id, JSON.stringify(projectRows[0])]
      );

      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM Proyectos WHERE id_proyecto = ?',
        [id]
      );

      await connection.commit();

      return result.affectedRows > 0;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // ==================== GET POR JEFE ====================

  static async getByJefe(jefeId: number): Promise<Project[]> {
    const query = `
      SELECT 
        p.*,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre_jefe,
        ep.nombre_estado AS estado_actual,
        COUNT(DISTINCT t.id_tarea) AS cantidad_tareas
      FROM Proyectos p
      LEFT JOIN Usuarios u ON p.id_jefe = u.id_usuario
      LEFT JOIN (
        SELECT id_proyecto, id_estado_proyecto
        FROM Proyecto_Estado_Historico peh1
        WHERE fecha_cambio = (
          SELECT MAX(fecha_cambio)
          FROM Proyecto_Estado_Historico peh2
          WHERE peh2.id_proyecto = peh1.id_proyecto
        )
      ) peh ON p.id_proyecto = peh.id_proyecto
      LEFT JOIN Estados_Proyecto ep ON peh.id_estado_proyecto = ep.id_estado_proyecto
      LEFT JOIN Tareas t ON p.id_proyecto = t.id_proyecto
      WHERE p.id_jefe = ?
      GROUP BY p.id_proyecto
      ORDER BY p.fecha_inicio DESC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, [jefeId]);
    return rows as Project[];
  }

  // ==================== GET POR COLABORADOR ====================

  static async getByColaborador(userId: number): Promise<Project[]> {
    const query = `
      SELECT DISTINCT
        p.*,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre_jefe,
        ep.nombre_estado AS estado_actual,
        me.rol_en_equipo
      FROM Proyectos p
      INNER JOIN Equipos eq ON eq.nombre_equipo LIKE CONCAT('%', p.nombre, '%')
      INNER JOIN Miembros_Equipo me ON eq.id_equipo = me.id_equipo
      LEFT JOIN Usuarios u ON p.id_jefe = u.id_usuario
      LEFT JOIN (
        SELECT id_proyecto, id_estado_proyecto
        FROM Proyecto_Estado_Historico peh1
        WHERE fecha_cambio = (
          SELECT MAX(fecha_cambio)
          FROM Proyecto_Estado_Historico peh2
          WHERE peh2.id_proyecto = peh1.id_proyecto
        )
      ) peh ON p.id_proyecto = peh.id_proyecto
      LEFT JOIN Estados_Proyecto ep ON peh.id_estado_proyecto = ep.id_estado_proyecto
      WHERE me.id_usuario = ? AND p.id_jefe != ?
      ORDER BY p.fecha_inicio DESC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, [userId, userId]);
    return rows as Project[];
  }

  // ==================== CAMBIAR ESTADO ====================

  static async changeStatus(projectId: number, nuevoEstadoId: number, userId: number): Promise<boolean> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        'INSERT INTO Proyecto_Estado_Historico (id_proyecto, id_estado_proyecto) VALUES (?, ?)',
        [projectId, nuevoEstadoId]
      );

      await connection.query(
        `INSERT INTO Logs_Auditoria (id_usuario, accion, tabla_afectada, registro_id, detalles)
         VALUES (?, 'CHANGE_STATUS_PROYECTO', 'Proyecto_Estado_Historico', ?, ?)`,
        [userId, projectId, `Nuevo estado: ${nuevoEstadoId}`]
      );

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // ==================== ESTADOS ====================

  static async getAllStatuses(): Promise<ProjectStatus[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM Estados_Proyecto ORDER BY id_estado_proyecto'
    );
    return rows as ProjectStatus[];
  }

  // ==================== MIEMBROS DE EQUIPO ====================

  static async addTeamMember(
    projectId: number,
    userId: number,
    rolEnEquipo: string,
    adminId: number
  ): Promise<boolean> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [equipoRows] = await connection.query<RowDataPacket[]>(
        `SELECT e.id_equipo
         FROM Equipos e
         INNER JOIN Proyectos p ON e.nombre_equipo LIKE CONCAT('%', p.nombre, '%')
         WHERE p.id_proyecto = ?
         LIMIT 1`,
        [projectId]
      );

      if (equipoRows.length === 0) throw new Error('No se encontró el equipo del proyecto');

      const equipoId = (equipoRows[0] as { id_equipo: number }).id_equipo;

      await connection.query(
        'INSERT INTO Miembros_Equipo (id_equipo, id_usuario, rol_en_equipo) VALUES (?, ?, ?)',
        [equipoId, userId, rolEnEquipo]
      );

      await connection.query(
        `INSERT INTO Logs_Auditoria (id_usuario, accion, tabla_afectada, registro_id, detalles)
         VALUES (?, 'ADD_TEAM_MEMBER', 'Miembros_Equipo', ?, ?)`,
        [adminId, projectId, `Usuario ${userId} agregado como ${rolEnEquipo}`]
      );

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // ==================== ESTADÍSTICAS ====================

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

    const [rows] = await pool.query<RowDataPacket[]>(query, [projectId]);
    return rows[0] || {};
  }
}
