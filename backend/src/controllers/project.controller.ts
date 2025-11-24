import type { Request, Response } from 'express';
import { ProjectModel } from '../models/Project.model.js';

export class ProjectController {
  
  // GET /api/projects
  static async getAll(req: Request, res: Response) {
    try {
      const projects = await ProjectModel.getAll();
      
      res.json({
        success: true,
        data: projects,
        total: projects.length
      });
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los proyectos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // GET /api/projects/:id
  static async getById(req: Request, res: Response) {
    try {
      // FIX TS: Asegurar que el parámetro es string antes de parseInt
      const idParam = req.params.id;
      const id = idParam ? parseInt(idParam) : NaN;
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de proyecto inválido o faltante'
        });
      }

      const project = await ProjectModel.getById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Proyecto no encontrado'
        });
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Error al obtener proyecto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el proyecto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // POST /api/projects
  static async create(req: Request, res: Response) {
    try {
      const { nombre, descripcion, fecha_inicio, fecha_fin, id_jefe, id_estado_proyecto } = req.body;

      // Validaciones
      if (!nombre || nombre.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'El nombre del proyecto es obligatorio y debe tener al menos 3 caracteres'
        });
      }

      if (!fecha_inicio) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de inicio es obligatoria'
        });
      }

      if (!id_jefe) {
        return res.status(400).json({
          success: false,
          message: 'El jefe del proyecto es obligatorio'
        });
      }

      // Validar que fecha_fin sea posterior a fecha_inicio
      if (fecha_fin && new Date(fecha_inicio) > new Date(fecha_fin)) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de fin debe ser posterior a la fecha de inicio'
        });
      }

      const project = await ProjectModel.create({
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        id_jefe,
        id_estado_proyecto
      });

      res.status(201).json({
        success: true,
        message: 'Proyecto creado exitosamente',
        data: project
      });
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el proyecto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // PUT /api/projects/:id
  static async update(req: Request, res: Response) {
    try {
      // FIX TS: Asegurar que el parámetro es string antes de parseInt
      const idParam = req.params.id;
      const id = idParam ? parseInt(idParam) : NaN;
      const userId = req.body.userId || 1; // TODO: Obtener del token JWT

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de proyecto inválido o faltante'
        });
      }

      const { nombre, descripcion, fecha_inicio, fecha_fin, id_jefe } = req.body;

      // Validar que fecha_fin sea posterior a fecha_inicio
      if (fecha_inicio && fecha_fin && new Date(fecha_inicio) > new Date(fecha_fin)) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de fin debe ser posterior a la fecha de inicio'
        });
      }

      const project = await ProjectModel.update(
        id,
        { nombre, descripcion, fecha_inicio, fecha_fin, id_jefe },
        userId
      );

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Proyecto no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Proyecto actualizado exitosamente',
        data: project
      });
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el proyecto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // DELETE /api/projects/:id
  static async delete(req: Request, res: Response) {
    try {
      // FIX TS: Asegurar que el parámetro es string antes de parseInt
      const idParam = req.params.id;
      const id = idParam ? parseInt(idParam) : NaN;
      const userId = req.body.userId || 1; // TODO: Obtener del token JWT

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de proyecto inválido o faltante'
        });
      }

      const deleted = await ProjectModel.delete(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Proyecto no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Proyecto eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el proyecto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // GET /api/projects/jefe/:jefeId
  static async getByJefe(req: Request, res: Response) {
    try {
      // FIX TS: Asegurar que el parámetro es string antes de parseInt
      const jefeIdParam = req.params.jefeId;
      const jefeId = jefeIdParam ? parseInt(jefeIdParam) : NaN;

      if (isNaN(jefeId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de jefe inválido o faltante'
        });
      }

      const projects = await ProjectModel.getByJefe(jefeId);

      res.json({
        success: true,
        data: projects,
        total: projects.length
      });
    } catch (error) {
      console.error('Error al obtener proyectos del jefe:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los proyectos del jefe',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // GET /api/projects/colaborador/:userId
  static async getByColaborador(req: Request, res: Response) {
    try {
      // FIX TS: Asegurar que el parámetro es string antes de parseInt
      const userIdParam = req.params.userId;
      const userId = userIdParam ? parseInt(userIdParam) : NaN;

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido o faltante'
        });
      }

      const projects = await ProjectModel.getByColaborador(userId);

      res.json({
        success: true,
        data: projects,
        total: projects.length
      });
    } catch (error) {
      console.error('Error al obtener proyectos del colaborador:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los proyectos del colaborador',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // PUT /api/projects/:id/status
  static async changeStatus(req: Request, res: Response) {
    try {
      // FIX TS: Asegurar que el parámetro es string antes de parseInt
      const idParam = req.params.id;
      const id = idParam ? parseInt(idParam) : NaN;
      const { id_estado_proyecto } = req.body;
      const userId = req.body.userId || 1; // TODO: Obtener del token JWT

      if (isNaN(id) || !id_estado_proyecto) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos'
        });
      }

      const updated = await ProjectModel.changeStatus(id, id_estado_proyecto, userId);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar el estado'
        });
      }

      res.json({
        success: true,
        message: 'Estado actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar el estado del proyecto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // GET /api/projects/statuses
  static async getAllStatuses(req: Request, res: Response) {
    try {
      const statuses = await ProjectModel.getAllStatuses();

      res.json({
        success: true,
        data: statuses
      });
    } catch (error) {
      console.error('Error al obtener estados:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los estados',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // POST /api/projects/:id/team
  static async addTeamMember(req: Request, res: Response) {
    try {
      // FIX TS: Asegurar que el parámetro es string antes de parseInt
      const projectIdParam = req.params.id;
      const projectId = projectIdParam ? parseInt(projectIdParam) : NaN;
      
      const { id_usuario, rol_en_equipo } = req.body;
      const adminId = req.body.adminId || 1; // TODO: Obtener del token JWT

      if (isNaN(projectId) || !id_usuario || !rol_en_equipo) {
        return res.status(400).json({
          success: false,
          message: 'Datos incompletos o ID de proyecto inválido'
        });
      }

      const added = await ProjectModel.addTeamMember(
        projectId,
        id_usuario,
        rol_en_equipo,
        adminId
      );

      if (!added) {
        return res.status(500).json({
          success: false,
          message: 'No se pudo agregar el miembro al equipo'
        });
      }

      res.json({
        success: true,
        message: 'Miembro agregado exitosamente al equipo'
      });
    } catch (error) {
      console.error('Error al agregar miembro:', error);
      res.status(500).json({
        success: false,
        message: 'Error al agregar miembro al equipo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // GET /api/projects/:id/statistics
  static async getStatistics(req: Request, res: Response) {
    try {
      // FIX TS: Asegurar que el parámetro es string antes de parseInt
      const idParam = req.params.id;
      const id = idParam ? parseInt(idParam) : NaN;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de proyecto inválido o faltante'
        });
      }

      const stats = await ProjectModel.getStatistics(id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las estadísticas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}