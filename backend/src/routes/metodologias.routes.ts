// src/routes/metodologias.routes.js
import { Router } from "express";
import { getMetodologias } from "../controllers/metodologias.controller.js";

const router = Router();

router.get("/", getMetodologias);

export default router;
