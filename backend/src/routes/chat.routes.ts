import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

// 1. OBTENER CHAT GRUPAL (Mensajes donde id_destinatario es NULL)
router.get("/chat/:idProyecto/general", (req, res) => {
    const { idProyecto } = req.params;

    const query = `
        SELECT m.id_mensaje, m.mensaje, m.fecha_envio, m.id_usuario, u.nombre, u.apellido
        FROM Mensajes m
        JOIN Usuarios u ON m.id_usuario = u.id_usuario
        WHERE m.id_proyecto = ? AND m.id_destinatario IS NULL
        ORDER BY m.fecha_envio ASC
    `;

    db.query(query, [idProyecto], (err, results) => {
        if (err) return res.status(500).json({ error: "Error cargando chat general" });
        res.json(results);
    });
});

// 2. OBTENER CHAT PRIVADO (Entre YO y OTRO usuario en este proyecto)
router.get("/chat/:idProyecto/privado/:idYo/:idOtro", (req, res) => {
    const { idProyecto, idYo, idOtro } = req.params;

    const query = `
        SELECT m.id_mensaje, m.mensaje, m.fecha_envio, m.id_usuario, u.nombre, u.apellido
        FROM Mensajes m
        JOIN Usuarios u ON m.id_usuario = u.id_usuario
        WHERE m.id_proyecto = ? 
        AND (
            (m.id_usuario = ? AND m.id_destinatario = ?) OR 
            (m.id_usuario = ? AND m.id_destinatario = ?)
        )
        ORDER BY m.fecha_envio ASC
    `;

    db.query(query, [idProyecto, idYo, idOtro, idOtro, idYo], (err, results) => {
        if (err) return res.status(500).json({ error: "Error cargando chat privado" });
        res.json(results);
    });
});

// 3. ENVIAR MENSAJE (Soporta Grupal y Privado)
router.post("/chat", (req, res) => {
    // Recibimos id_destinatario (puede ser null o un numero)
    const { id_proyecto, id_usuario, mensaje, id_destinatario } = req.body; 

    const query = `
        INSERT INTO Mensajes (id_proyecto, id_usuario, mensaje, id_destinatario)
        VALUES (?, ?, ?, ?)
    `;

    // Si id_destinatario no viene, se guarda como NULL (Chat General)
    const dest = id_destinatario || null;

    db.query(query, [id_proyecto, id_usuario, mensaje, dest], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error enviando mensaje" });
        }
        res.json({ message: "Enviado" });
    });
});

export default router;