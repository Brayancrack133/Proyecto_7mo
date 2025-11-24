// src/controllers/proyectos.controller.ts
import { Request, Response } from "express";
import * as proyectoService from "../services/proyecto.service.js";

export const crearProyecto = async (req: Request, res: Response) => {
  try {
    const nuevo = await proyectoService.crearProyecto(req.body);
    res.json(nuevo);
  } catch (error) {
    console.error("Error creando proyecto:", error);
    res.status(500).json({ error: "Error creando proyecto" });
  }
};
