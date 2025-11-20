import { Request, Response } from "express";
import * as rolesService from "../services/roles.service";

export const obtenerRoles = async (_: Request, res: Response) => {
  res.json(await rolesService.obtenerRoles());
};

export const crearRol = async (req: Request, res: Response) => {
  res.json(await rolesService.crearRol(req.body));
};

export const editarRol = async (req: Request, res: Response) => {
  res.json(await rolesService.editarRol(Number(req.params.id), req.body));
};

export const eliminarRol = async (req: Request, res: Response) => {
  res.json(await rolesService.eliminarRol(Number(req.params.id)));
};
