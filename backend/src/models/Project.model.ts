import { pool } from '../config/db.js';
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
  
  /**
   * Obtener todos los proyectos con información del jefe y estado actual
   */
  static async getAll(): Promise<Project[]> {
    const query = `
      SELECT 
        p.id_proyecto,
        p.nombre,
        p.descripcion,
        p.fecha_inicio,
        p.fecha_fin,
        p.id_jefe,
        CONCAT(u.nombre, ' ', u.apellido) as nombre_jefe,
        ep.nombre_estado as estado_actual,
        peh.id_estado_proyecto,
        COUNT(DISTINCT t.id_tarea) as cantidad_tareas
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

    // CORREGIDO: Eliminado .promise()
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows as Project[];
  }

  /**
   * Obtener proyecto por ID con detalles completos
   */
  static async getById(id: number): Promise<ProjectWithDetails | null> {
    // Información básica del proyecto
    const projectQuery = `
      SELECT 
        p.*,
        CONCAT(u.nombre, ' ', u.apellido) as nombre_jefe,
        u.correo as correo_jefe,
        ep.nombre_estado as estado_actual,
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

    // CORREGIDO: Eliminado .promise()
    const [projectRows] = await pool.query<RowDataPacket[]>(projectQuery, [id]);
    
    if (projectRows.length === 0) {
      return null;
    }

    const project = projectRows[0] as ProjectWithDetails;

    // Obtener equipo del proyecto
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

    // CORREGIDO: Eliminado .promise()
    const [teamRows] = await pool.query<RowDataPacket[]>(teamQuery, [project.nombre]);
    project.equipo = teamRows as any;

    // Obtener tareas del proyecto
    const tasksQuery = `
      SELECT 
        t.*,
        CONCAT(u.nombre, ' ', u.apellido) as nombre_responsable,
        pr.nombre_prioridad as prioridad_actual
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

    // CORREGIDO: Eliminado .promise()
    const [tasksRows] = await pool.query<RowDataPacket[]>(tasksQuery, [id]);
    project.tareas = tasksRows as any;

    return project;
  }

  /**
   * Crear nuevo proyecto
   */
  static async create(data: ProjectCreate): Promise<Project> {
    // CORREGIDO: Eliminado .promise()
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Insertar proyecto
      const insertQuery = `
        INSERT INTO Proyectos (nombre, descripcion, fecha_inicio, fecha_fin, id_jefe)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await connection.query<ResultSetHeader>(
        insertQuery,
        [
          data.nombre,
          data.descripcion || null,
          data.fecha_inicio,
          data.fecha_fin || null,
          data.id_jefe
        ]
      );

      const projectId = result.insertId;

      // 2. Asignar estado inicial (Planificación por defecto)
      const estadoId = data.id_estado_proyecto || 1; // 1 = Planificación
      
      await connection.query(
        'INSERT INTO Proyecto_Estado_Historico (id_proyecto, id_estado_proyecto) VALUES (?, ?)',
        [projectId, estadoId]
      );

      // 3. Crear equipo para el proyecto
      await connection.query(
        'INSERT INTO Equipos (nombre_equipo) VALUES (?)',
        [`Equipo ${data.nombre}`]
      );

      const [equipoResult] = await connection.query<RowDataPacket[]>(
        'SELECT LAST_INSERT_ID() as id_equipo'
      );

      const equipoId = (equipoResult[0] as { id_equipo: number } | undefined)?.id_equipo;
      
      if (!equipoId) {
        throw new Error('No se pudo obtener el ID del equipo recién creado');
      }

      // 4. Agregar al jefe como líder del equipo
      await connection.query(
        'INSERT INTO Miembros_Equipo (id_equipo, id_usuario, rol_en_equipo) VALUES (?, ?, ?)',
        [equipoId, data.id_jefe, 'Jefe de Proyecto']
      );

      // 5. Registrar en auditoría
      await connection.query(
        `INSERT INTO Logs_Auditoria (id_usuario, accion, tabla_afectada, registro_id, detalles)
          VALUES (?, 'CREATE_PROYECTO', 'Proyectos', ?, ?)`,
        [data.id_jefe, projectId, JSON.stringify(data)]
      );

      await connection.commit();

      // Obtener proyecto creado
      const project = await this.getById(projectId);
      return project as Project;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Actualizar proyecto
   */
  static async update(id: number, data: ProjectUpdate, userId: number): Promise<Project | null> {
    // CORREGIDO: Eliminado .promise()
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const fields: string[] = [];
      const values: any[] = [];

      if (data.nombre !== undefined) {
        fields.push('nombre = ?');
        values.push(data.nombre);
      }
      if (data.descripcion !== undefined) {
        fields.push('descripcion = ?');
        values.push(data.descripcion);
      }
      if (data.fecha_inicio !== undefined) {
        fields.push('fecha_inicio = ?');
        values.push(data.fecha_inicio);
      }
      if (data.fecha_fin !== undefined) {
        fields.push('fecha_fin = ?');
        values.push(data.fecha_fin);
      }
      if (data.id_jefe !== undefined) {
        fields.push('id_jefe = ?');
        values.push(data.id_jefe);
      }

      if (fields.length === 0) {
        await connection.rollback();
        return this.getById(id) as any;
      }

      values.push(id);

      await connection.query(
        `UPDATE Proyectos SET ${fields.join(', ')} WHERE id_proyecto = ?`,
        values
      );

      // Registrar en auditoría
      await connection.query(
        `INSERT INTO Logs_Auditoria (id_usuario, accion, tabla_afectada, registro_id, detalles)
          VALUES (?, 'UPDATE_PROYECTO', 'Proyectos', ?, ?)`,
        [userId, id, JSON.stringify(data)]
      );

      await connection.commit();

      return this.getById(id) as any;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Eliminar proyecto (soft delete o cascada según configuración)
   */
  static async delete(id: number, userId: number): Promise<boolean> {
    // CORREGIDO: Eliminado .promise()
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Verificar que el proyecto existe
      const [projectRows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM Proyectos WHERE id_proyecto = ?',
        [id]
      );

      if (projectRows.length === 0) {
        await connection.rollback();
        return false;
      }

      // Registrar en auditoría antes de eliminar
      await connection.query(
        `INSERT INTO Logs_Auditoria (id_usuario, accion, tabla_afectada, registro_id, detalles)
          VALUES (?, 'DELETE_PROYECTO', 'Proyectos', ?, ?)`,
        [userId, id, JSON.stringify(projectRows[0])]
      );

      // Eliminar proyecto (CASCADE eliminará tareas, documentos, etc.)
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

  // ==================== MÉTODOS ADICIONALES ====================

  /**
   * Obtener proyectos por jefe
   */
  static async getByJefe(jefeId: number): Promise<Project[]> {
    const query = `
      SELECT 
        p.*,
        CONCAT(u.nombre, ' ', u.apellido) as nombre_jefe,
        ep.nombre_estado as estado_actual,
        COUNT(DISTINCT t.id_tarea) as cantidad_tareas
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

    // CORREGIDO: Eliminado .promise()
    const [rows] = await pool.query<RowDataPacket[]>(query, [jefeId]);
    return rows as Project[];
  }

  /**
   * Obtener proyectos donde el usuario es colaborador
   */
  static async getByColaborador(userId: number): Promise<Project[]> {
    const query = `
      SELECT DISTINCT
        p.*,
        CONCAT(u.nombre, ' ', u.apellido) as nombre_jefe,
        ep.nombre_estado as estado_actual,
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

    // CORREGIDO: Eliminado .promise()
    const [rows] = await pool.query<RowDataPacket[]>(query, [userId, userId]);
    return rows as Project[];
  }

  /**
   * Cambiar estado del proyecto
   */
  static async changeStatus(projectId: number, nuevoEstadoId: number, userId: number): Promise<boolean> {
    // CORREGIDO: Eliminado .promise()
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Insertar nuevo estado en el histórico
      await connection.query(
        'INSERT INTO Proyecto_Estado_Historico (id_proyecto, id_estado_proyecto) VALUES (?, ?)',
        [projectId, nuevoEstadoId]
      );

      // Registrar en auditoría
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

  /**
   * Obtener todos los estados disponibles
   */
  static async getAllStatuses(): Promise<ProjectStatus[]> {
    // CORREGIDO: Eliminado .promise()
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM Estados_Proyecto ORDER BY id_estado_proyecto'
    );
    return rows as ProjectStatus[];
  }

  /**
   * Agregar miembro al equipo del proyecto
   */
  static async addTeamMember(
    projectId: number, 
    userId: number, 
    rolEnEquipo: string,
    adminId: number
  ): Promise<boolean> {
    // CORREGIDO: Eliminado .promise()
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Obtener el equipo del proyecto
      const [equipoRows] = await connection.query<RowDataPacket[]>(
        `SELECT e.id_equipo 
          FROM Equipos e 
          INNER JOIN Proyectos p ON e.nombre_equipo LIKE CONCAT('%', p.nombre, '%')
          WHERE p.id_proyecto = ? 
          LIMIT 1`,
        [projectId]
      );

      if (equipoRows.length === 0) {
        throw new Error('No se encontró el equipo del proyecto');
      }

      const equipoId = (equipoRows[0] as { id_equipo: number }).id_equipo; 

      // Agregar miembro
      await connection.query(
        'INSERT INTO Miembros_Equipo (id_equipo, id_usuario, rol_en_equipo) VALUES (?, ?, ?)',
        [equipoId, userId, rolEnEquipo]
      );

      // Registrar en auditoría
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

  /**
   * Obtener estadísticas del proyecto
   */
  static async getStatistics(projectId: number) {
    const query = `
      SELECT 
        COUNT(DISTINCT t.id_tarea) as total_tareas,
        COUNT(DISTINCT CASE WHEN t.fecha_fin < NOW() THEN t.id_tarea END) as tareas_vencidas,
        COUNT(DISTINCT me.id_usuario) as total_miembros,
        COUNT(DISTINCT d.id_doc) as total_documentos
      FROM Proyectos p
      LEFT JOIN Tareas t ON p.id_proyecto = t.id_proyecto
      LEFT JOIN Equipos e ON e.nombre_equipo LIKE CONCAT('%', p.nombre, '%')
      LEFT JOIN Miembros_Equipo me ON e.id_equipo = me.id_equipo
      LEFT JOIN Documentos d ON p.id_proyecto = d.id_proyecto
      WHERE p.id_proyecto = ?
      GROUP BY p.id_proyecto
    `;

    // CORREGIDO: Eliminado .promise()
    const [rows] = await pool.query<RowDataPacket[]>(query, [projectId]);
    return rows[0] || {};
  }
}