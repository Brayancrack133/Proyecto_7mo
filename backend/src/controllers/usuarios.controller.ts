import { Request, Response } from "express";
import * as usuarioService from "../services/usuarios.service.js";

export const obtenerUsuarios = async (_: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};

export const buscarUsuarios = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const usuarios = await usuarioService.buscarUsuarios(q);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error buscando usuarios" });
  }
};

// Controlador para crear un usuario
export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const nuevo = await usuarioService.crearUsuario(req.body);
    res.json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error creando usuario" });
  }
};


// Controlador para editar un usuario

export const editarUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    
    // Si se subió un archivo, agregamos la ruta a los datos
    if (req.file) {
        // Guardamos la ruta relativa para accederla desde el frontend
        data.foto = `/uploads/${req.file.filename}`;
    }

    const actualizado = await usuarioService.editarUsuario(id, data);
    res.json(actualizado);
  } catch (error) {
    console.error("Error editando usuario:", error);
    res.status(500).json({ error: "Error editando usuario" });
  }
};


// Controlador para cambiar el estado del usuario
export const cambiarEstadoUsuario = async (req: Request, res: Response) => {
  try {
    const actualizado = await usuarioService.cambiarEstadoUsuario(Number(req.params.id));
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error cambiando estado" });
  }
};

