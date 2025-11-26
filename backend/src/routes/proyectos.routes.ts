import { Router } from "express";
import { db } from "../config/db.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const router = Router();

// ==============================================================
// RUTA 1: Obtener lista de proyectos (Para "Mis Proyectos")
// ==============================================================
router.get("/mis-proyectos/:idUsuario", async (req, res) => {
    const { idUsuario } = req.params;

    const query = `
        SELECT 
            p.id_proyecto,
            p.nombre,
            p.descripcion,
            p.fecha_inicio,
            p.fecha_fin,
            IF(p.id_jefe = me.id_usuario, 'Líder de proyecto', 'Integrante') AS rol,
            e.nombre_equipo
        FROM proyectos p
        JOIN equipos e ON p.id_equipo = e.id_equipo
        JOIN miembros_equipo me ON me.id_equipo = e.id_equipo
        WHERE me.id_usuario = ?
    `;

    try {
        const [results] = await db.query(query, [idUsuario]);
        res.json(results);
    } catch (err) {
        console.error("Error DB:", err);
        res.status(500).json({ error: "Error al obtener proyectos" });
    }
});

// ==============================================================
// RUTA 2: Verificar Rol
// ==============================================================
router.get("/proyecto/:idProyecto/usuario/:idUsuario", async (req, res) => {
    const { idProyecto, idUsuario } = req.params;

    const query = `
        SELECT 
            p.id_proyecto,
            p.nombre,
            p.id_jefe,
            IF(p.id_jefe = ?, 'Líder', 'Integrante') AS rol_calculado
        FROM proyectos p
        WHERE p.id_proyecto = ?
    `;

    try {
        const [results] = await db.query<RowDataPacket[]>(query, [idUsuario, idProyecto]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }
        res.json(results[0]);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Error DB" });
    }
});

// ==============================================================
// RUTA 3: Obtener Miembros
// ==============================================================
router.get("/proyecto/:idProyecto/miembros", async (req, res) => {
    const { idProyecto } = req.params;

    const query = `
        SELECT 
            u.id_usuario,
            u.nombre,
            u.apellido,
            me.rol_en_equipo 
        FROM proyectos p
        JOIN miembros_equipo me ON p.id_equipo = me.id_equipo
        JOIN usuarios u ON me.id_usuario = u.id_usuario
        WHERE p.id_proyecto = ?
    `;

    try {
        const [results] = await db.query(query, [idProyecto]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener miembros" });
    }
});

// ==============================================================
// RUTA 4: CREAR NUEVO PROYECTO (Con transacciones manuales)
// ==============================================================
router.post("/proyectos", async (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, id_usuario } = req.body;
    const connection = await db.getConnection(); // Obtenemos una conexión para la transacción

    try {
        await connection.beginTransaction();

        // 1. Crear Equipo
        const [resultEq] = await connection.query<ResultSetHeader>(
            "INSERT INTO equipos (nombre_equipo) VALUES (?)", 
            [nombre]
        );
        const idEquipo = resultEq.insertId;

        // 2. Crear Proyecto
        await connection.query(
            `INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin, id_jefe, id_equipo)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, idEquipo]
        );

        // 3. Asignar Líder
        await connection.query(
            `INSERT INTO miembros_equipo (id_equipo, id_usuario, rol_en_equipo)
             VALUES (?, ?, 'Líder de Proyecto')`,
            [idEquipo, id_usuario]
        );

        await connection.commit();
        res.json({ message: "Proyecto creado exitosamente" });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: "Error creando proyecto" });
    } finally {
        connection.release();
    }
});

// ==============================================================
// RUTA 5: VER PROYECTOS DISPONIBLES
// ==============================================================
router.get("/proyectos/otros/:idUsuario", async (req, res) => {
    const { idUsuario } = req.params;
    const query = `
        SELECT p.id_proyecto, p.nombre, p.descripcion, u.nombre as nombre_jefe 
        FROM proyectos p
        JOIN usuarios u ON p.id_jefe = u.id_usuario
        WHERE p.id_equipo NOT IN (
            SELECT id_equipo FROM miembros_equipo WHERE id_usuario = ?
        )
    `;
    try {
        const [results] = await db.query(query, [idUsuario]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Error buscando proyectos" });
    }
});

// ==============================================================
// RUTA 6: SOLICITAR UNIRSE 
// ==============================================================
router.post("/proyectos/solicitar-union", async (req, res) => {
    const { id_proyecto, id_usuario_solicitante } = req.body;

    try {
        const queryDatos = `
            SELECT p.id_jefe, p.nombre as nombre_proyecto, u.nombre, u.apellido 
            FROM proyectos p
            JOIN usuarios u ON u.id_usuario = ? 
            WHERE p.id_proyecto = ?
        `;
        const [results] = await db.query<RowDataPacket[]>(queryDatos, [id_usuario_solicitante, id_proyecto]);

        if (results.length === 0) return res.status(500).json({ error: "Error datos" });

        const { id_jefe, nombre, apellido, nombre_proyecto } = results[0];
        const contenido = `${nombre} ${apellido} ha solicitado unirse a tu proyecto "${nombre_proyecto}"`;

        const queryNoti = `
            INSERT INTO notificaciones (id_usuario_destino, id_tipo_notificacion, contenido, id_proyecto, id_usuario_remitente)
            VALUES (?, 4, ?, ?, ?)
        `;
        await db.query(queryNoti, [id_jefe, contenido, id_proyecto, id_usuario_solicitante]);
        
        res.json({ message: "Solicitud enviada al líder" });

    } catch (err) {
        res.status(500).json({ error: "Error enviando solicitud" });
    }
});

// ==============================================================
// RUTA 7: ACEPTAR SOLICITUD DE UNIÓN
// ==============================================================
router.post("/proyectos/aceptar-union", async (req, res) => {
    const { id_proyecto, id_usuario_nuevo } = req.body;

    const query = `
        INSERT INTO miembros_equipo (id_equipo, id_usuario, rol_en_equipo)
        SELECT id_equipo, ?, 'Integrante' 
        FROM proyectos WHERE id_proyecto = ?
    `;

    try {
        await db.query(query, [id_usuario_nuevo, id_proyecto]);
        res.json({ message: "Usuario aceptado en el equipo" });
    } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.json({ message: "El usuario ya era miembro" });
        }
        return res.status(500).json({ error: "Error aceptando miembro" });
    }
});

export default router;