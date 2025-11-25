// src/controllers/metodologias.controller.js
import type { Request, Response } from 'express';
import * as metodologiasService from "../services/metodologias.service.js";

export const getMetodologias = async (req: Request, res: Response) => {
  try {
    const metodologias = await metodologiasService.listarMetodologias();
    res.json(metodologias);
  } catch (err) {
    console.error("Error listando metodologias:", err);
    res.status(500).json({ error: "Error listando metodologias" });
  }
};
