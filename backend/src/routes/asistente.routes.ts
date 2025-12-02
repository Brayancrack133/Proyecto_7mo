import { Router } from "express";
import { chatAsistente } from "../controllers/asistente.controller.js";

const router = Router();

// POST: http://localhost:3000/api/asistente/chat
router.post("/chat", chatAsistente);

export default router;