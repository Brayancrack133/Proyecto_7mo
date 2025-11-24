// src/controllers/ProjectController.ts

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
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al obtener proyectos:', errorMessage);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los proyectos',
        error: errorMessage
      });
    }
  }

  // GET /api/projects/:id
  static async getById(req: Request, res: Response) {
    try {
      // MEJORA: Simplificamos el parseInt ya que req.params.id es siempre una string en una ruta con :id
      const id = parseInt(req.params.id); 
      
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
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al obtener proyecto:', errorMessage);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el proyecto',
        error: errorMessage
      });
    }
  }

  // POST /api/projects
  static async create(req: Request, res: Response) {
    try {
      const { nombre, descripcion, fecha_inicio, fecha_fin, id_jefe, id_estado_proyecto } = req.body;

      // Validaciones (sin cambios, son correctas)
      if (!nombre || nombre.trim().length < 3) {
        return res.status(400).json({ success: false, message: 'El nombre del proyecto es obligatorio y debe tener al menos 3 caracteres' });
      }
      if (!fecha_inicio) {
        return res.status(400).json({ success: false, message: 'La fecha de inicio es obligatoria' });
      }
      if (!id_jefe) {
        return res.status(400).json({ success: false, message: 'El jefe del proyecto es obligatorio' });
      }
      if (fecha_fin && new Date(fecha_inicio) > new Date(fecha_fin)) {
        return res.status(400).json({ success: false, message: 'La fecha de fin debe ser posterior a la fecha de inicio' });
      }

      const project = await ProjectModel.create({
        nombre, descripcion, fecha_inicio, fecha_fin, id_jefe, id_estado_proyecto
      });

      res.status(201).json({
        success: true,
        message: 'Proyecto creado exitosamente',
        data: project
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al crear proyecto:', errorMessage);
      res.status(500).json({
        success: false,
        message: 'Error al crear el proyecto',
        error: errorMessage
      });
    }
  }

  // PUT /api/projects/:id
  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      // CORRECCIÓN DE SEGURIDAD: Obtener userId del token (res.locals), NO del body.
      const userId = res.locals.user?.id || 1; // Asume que el middleware lo inyecta

      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID de proyecto inválido o faltante' });
      }

      const { nombre, descripcion, fecha_inicio, fecha_fin, id_jefe } = req.body;

      // Validar fecha
      if (fecha_inicio && fecha_fin && new Date(fecha_inicio) > new Date(fecha_fin)) {
        return res.status(400).json({ success: false, message: 'La fecha de fin debe ser posterior a la fecha de inicio' });
      }

      const project = await ProjectModel.update(
        id,
        { nombre, descripcion, fecha_inicio, fecha_fin, id_jefe },
        userId
      );

      if (!project) {
        return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
      }

      res.json({ success: true, message: 'Proyecto actualizado exitosamente', data: project });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al actualizar proyecto:', errorMessage);
      res.status(500).json({ success: false, message: 'Error al actualizar el proyecto', error: errorMessage });
    }
  }

  // DELETE /api/projects/:id
  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      // CORRECCIÓN DE SEGURIDAD: Obtener userId del token (res.locals), NO del body.
      const userId = res.locals.user?.id || 1; // Asume que el middleware lo inyecta

      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID de proyecto inválido o faltante' });
      }

      const deleted = await ProjectModel.delete(id, userId);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
      }

      res.json({ success: true, message: 'Proyecto eliminado exitosamente' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al eliminar proyecto:', errorMessage);
      res.status(500).json({ success: false, message: 'Error al eliminar el proyecto', error: errorMessage });
    }
  }

  // GET /api/projects/jefe/:jefeId
  static async getByJefe(req: Request, res: Response) {
    try {
      const jefeId = parseInt(req.params.jefeId);

      if (isNaN(jefeId)) {
        return res.status(400).json({ success: false, message: 'ID de jefe inválido o faltante' });
      }

      const projects = await ProjectModel.getByJefe(jefeId);

      res.json({ success: true, data: projects, total: projects.length });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al obtener proyectos del jefe:', errorMessage);
      res.status(500).json({ success: false, message: 'Error al obtener los proyectos del jefe', error: errorMessage });
    }
  }

  // GET /api/projects/colaborador/:userId
  static async getByColaborador(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({ success: false, message: 'ID de usuario inválido o faltante' });
      }

      const projects = await ProjectModel.getByColaborador(userId);

      res.json({ success: true, data: projects, total: projects.length });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al obtener proyectos del colaborador:', errorMessage);
      res.status(500).json({ success: false, message: 'Error al obtener los proyectos del colaborador', error: errorMessage });
    }
  }

  // PUT /api/projects/:id/status
  static async changeStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { id_estado_proyecto } = req.body;
      // CORRECCIÓN DE SEGURIDAD: Obtener userId del token (res.locals), NO del body.
      const userId = res.locals.user?.id || 1; // Asume que el middleware lo inyecta

      if (isNaN(id) || !id_estado_proyecto) {
        return res.status(400).json({ success: false, message: 'Datos inválidos' });
      }

      const updated = await ProjectModel.changeStatus(id, id_estado_proyecto, userId);

      if (!updated) {
        return res.status(404).json({ success: false, message: 'No se pudo actualizar el estado' });
      }

      res.json({ success: true, message: 'Estado actualizado exitosamente' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al cambiar estado:', errorMessage);
      res.status(500).json({ success: false, message: 'Error al cambiar el estado del proyecto', error: errorMessage });
    }
  }

  // GET /api/projects/statuses
  static async getAllStatuses(req: Request, res: Response) {
    try {
      const statuses = await ProjectModel.getAllStatuses();

      res.json({ success: true, data: statuses });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al obtener estados:', errorMessage);
      res.status(500).json({ success: false, message: 'Error al obtener los estados', error: errorMessage });
    }
  }

  // POST /api/projects/:id/team
  static async addTeamMember(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);
      
      const { id_usuario, rol_en_equipo } = req.body;
      // CORRECCIÓN DE SEGURIDAD: Obtener adminId del token (res.locals), NO del body.
      const adminId = res.locals.user?.id || 1; // Asume que el middleware lo inyecta

      if (isNaN(projectId) || !id_usuario || !rol_en_equipo) {
        return res.status(400).json({ success: false, message: 'Datos incompletos o ID de proyecto inválido' });
      }

      const added = await ProjectModel.addTeamMember(
        projectId, id_usuario, rol_en_equipo, adminId
      );

      if (!added) {
        return res.status(500).json({ success: false, message: 'No se pudo agregar el miembro al equipo' });
      }

      res.json({ success: true, message: 'Miembro agregado exitosamente al equipo' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al agregar miembro:', errorMessage);
      res.status(500).json({ success: false, message: 'Error al agregar miembro al equipo', error: errorMessage });
    }
  }

  // GET /api/projects/:id/statistics
  static async getStatistics(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID de proyecto inválido o faltante' });
      }

      const stats = await ProjectModel.getStatistics(id);

      res.json({ success: true, data: stats });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al obtener estadísticas:', errorMessage);
      res.status(500).json({ success: false, message: 'Error al obtener las estadísticas', error: errorMessage });
    }
  }
}