// src/controllers/proyectos.controller.js
import { Request, Response } from "express";
import * as proyectosService from "../services/proyecto.service";

export const crearProyecto = async (req: Request, res: Response) => {
  try {
    const nuevoProyecto = await proyectosService.crearProyecto(req.body);
    res.status(201).json(nuevoProyecto); // Enviar el proyecto creado
  } catch (error) {
  console.error("Error al crear el proyecto:", error);

  const mensaje = error instanceof Error ? error.message : "Error desconocido";

  res.status(500).json({
    error: "Error creando proyecto",
    detalles: mensaje,
  });
  }
};
