import { Router, Request, Response } from "express";
import { db } from "../config/db.js";

const router = Router();

// ==============================================================
// RUTA 1: Obtener lista de proyectos
// ==============================================================
router.get("/mis-proyectos/:idUsuario", async (req: Request, res: Response) => {
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
        FROM Proyectos p
        JOIN Equipos e ON p.id_equipo = e.id_equipo
        JOIN Miembros_Equipo me ON me.id_equipo = e.id_equipo
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
router.get("/proyecto/:idProyecto/usuario/:idUsuario", async (req: Request, res: Response) => {
    const { idProyecto, idUsuario } = req.params;

    const query = `
        SELECT 
            p.id_proyecto,
            p.nombre,
            p.id_jefe,
            IF(p.id_jefe = ?, 'Líder', 'Integrante') AS rol_calculado
        FROM Proyectos p
        WHERE p.id_proyecto = ?
    `;

    try {
        const [results]: any = await db.query(query, [idUsuario, idProyecto]);

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
// RUTA 3: Obtener Miembros del Equipo
// ==============================================================
router.get("/proyecto/:idProyecto/miembros", async (req: Request, res: Response) => {
    const { idProyecto } = req.params;

    const query = `
        SELECT 
            u.id_usuario,
            u.nombre,
            u.apellido,
            me.rol_en_equipo
        FROM Proyectos p
        JOIN Miembros_Equipo me ON p.id_equipo = me.id_equipo
        JOIN Usuarios u ON me.id_usuario = u.id_usuario
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
// RUTA 4: CREAR NUEVO PROYECTO (TU LÓGICA TRADUCIDA A TYPESCRIPT)
// ==============================================================
router.post("/proyectos", async (req: Request, res: Response) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, id_usuario } = req.body;

    try {
        // 1. Primero creamos el Equipo 
        const queryEquipo = "INSERT INTO Equipos (nombre_equipo) VALUES (?)";
        const [resultEq]: any = await db.query(queryEquipo, [`Equipo de ${nombre}`]); // Agregué "Equipo de..." para que se vea mejor
        const idEquipo = resultEq.insertId;

        // 2. Creamos el Proyecto
        // CORRECCIÓN: Quitamos 'id_estado_proyecto' porque no existe en tu tabla Proyectos
        const queryProy = `
            INSERT INTO Proyectos (nombre, descripcion, fecha_inicio, fecha_fin, id_jefe, id_equipo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        // Nota: Añadí el "1" al final para el estado por defecto (Planificación), ya que tu BDD lo pide.

        await db.query(queryProy, [nombre, descripcion, fecha_inicio, fecha_fin || null, id_usuario, idEquipo]);
        // 3. Agregamos al usuario como Líder
        const queryMiembro = `
            INSERT INTO Miembros_Equipo (id_equipo, id_usuario, rol_en_equipo)
            VALUES (?, ?, 'Líder de Proyecto')
        `;

        await db.query(queryMiembro, [idEquipo, id_usuario]);

        res.json({ message: "Proyecto creado exitosamente" });

    } catch (error) {
        console.error("Error creando proyecto:", error);
        res.status(500).json({ error: "Error creando proyecto" });
    }
});

// ==============================================================
// RUTA 5: VER PROYECTOS DISPONIBLES
// ==============================================================
router.get("/proyectos/otros/:idUsuario", async (req: Request, res: Response) => {
    const { idUsuario } = req.params;
    const query = `
        SELECT p.id_proyecto, p.nombre, p.descripcion, u.nombre as nombre_jefe 
        FROM Proyectos p
        JOIN Usuarios u ON p.id_jefe = u.id_usuario
        WHERE p.id_equipo NOT IN (
            SELECT id_equipo FROM Miembros_Equipo WHERE id_usuario = ?
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
router.post("/proyectos/solicitar-union", async (req: Request, res: Response) => {
    const { id_proyecto, id_usuario_solicitante } = req.body;

    const queryDatos = `
        SELECT p.id_jefe, p.nombre as nombre_proyecto, u.nombre, u.apellido 
        FROM Proyectos p
        JOIN Usuarios u ON u.id_usuario = ? 
        WHERE p.id_proyecto = ?
    `;

    try {
        const [results]: any = await db.query(queryDatos, [id_usuario_solicitante, id_proyecto]);

        if (results.length === 0) return res.status(500).json({ error: "Error datos" });

        const { id_jefe, nombre, apellido, nombre_proyecto } = results[0];
        const contenido = `${nombre} ${apellido} ha solicitado unirse a tu proyecto "${nombre_proyecto}"`;
        const queryNoti = `
            INSERT INTO Notificaciones (id_usuario_destino, id_tipo_notificacion, contenido, id_usuario_remitente, id_proyecto)
            VALUES (?, 4, ?, ?, ?)
        `;

        await db.query(queryNoti, [id_jefe, contenido, id_usuario_solicitante, id_proyecto]);
        res.json({ message: "Solicitud enviada al líder" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error enviando solicitud" });
    }
});
// ==============================================================
// RUTA 7: ACEPTAR SOLICITUD DE UNIÓN (Lo que te faltaba)
// ==============================================================
router.post("/proyectos/aceptar-union", async (req: Request, res: Response) => {
    const { id_proyecto, id_usuario_nuevo } = req.body;

    // Insertar en Miembros_Equipo con rol 'Integrante'
    const query = `
        INSERT INTO Miembros_Equipo (id_equipo, id_usuario, rol_en_equipo)
        SELECT id_equipo, ?, 'Integrante' 
        FROM Proyectos WHERE id_proyecto = ?
    `;

    try {
        await db.query(query, [id_usuario_nuevo, id_proyecto]);
        res.json({ message: "Usuario aceptado en el equipo" });
    } catch (err: any) {
        // Si ya existe (error duplicado), no pasa nada, devolvemos éxito igual
        // Nota: MySQL devuelve el código de error como string o número dependiendo de la librería, 
        // cubrimos ambos casos por si acaso.
        if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
            return res.json({ message: "El usuario ya era miembro" });
        }
        console.error("Error aceptando miembro:", err);
        res.status(500).json({ error: "Error aceptando miembro" });
    }
});

export default router;