// src/controllers/proyectos.controller.js
import type { Request, Response } from 'express';
import * as proyectosService from "../services/proyecto.service.js";

export const crearProyecto = async (req: Request, res: Response) => {
  try {
    const nuevo = await proyectosService.crearProyecto(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error creando proyecto:", error);
    res.status(500).json({ error: "Error creando proyecto" });
  }
};
