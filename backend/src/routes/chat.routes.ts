import { Router } from "express";
// Importamos dbRaw
import { dbRaw } from "../config/db.js";

// Forzamos a que 'db' sea cualquier cosa para que TS no moleste con los métodos
const db: any = dbRaw;

const router = Router();

// 1. OBTENER CHAT GRUPAL
router.get("/chat/:idProyecto/general", (req, res) => {
    const { idProyecto } = req.params;

    const query = `
        SELECT m.id_mensaje, m.mensaje, m.fecha_envio, m.id_usuario, u.nombre, u.apellido
        FROM Mensajes m
        JOIN Usuarios u ON m.id_usuario = u.id_usuario
        WHERE m.id_proyecto = ? AND m.id_destinatario IS NULL
        ORDER BY m.fecha_envio ASC
    `;

    // AGREGAMOS ': any' AQUÍ 👇
    db.query(query, [idProyecto], (err: any, results: any) => {
        if (err) return res.status(500).json({ error: "Error cargando chat general" });
        res.json(results);
    });
});

// 2. OBTENER CHAT PRIVADO
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

    // AGREGAMOS ': any' AQUÍ 👇
    db.query(query, [idProyecto, idYo, idOtro, idOtro, idYo], (err: any, results: any) => {
        if (err) return res.status(500).json({ error: "Error cargando chat privado" });
        res.json(results);
    });
});

// 3. ENVIAR MENSAJE
router.post("/chat", (req, res) => {
    const { id_proyecto, id_usuario, mensaje, id_destinatario } = req.body;

    const query = `
        INSERT INTO Mensajes (id_proyecto, id_usuario, mensaje, id_destinatario)
        VALUES (?, ?, ?, ?)
    `;

    const dest = id_destinatario || null;

    // AGREGAMOS ': any' AQUÍ 👇
    db.query(query, [id_proyecto, id_usuario, mensaje, dest], (err: any, result: any) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error enviando mensaje" });
        }
        res.json({ message: "Enviado" });
    });
});

export default router;