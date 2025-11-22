import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

// ==============================================================
// RUTA 1: Obtener lista de proyectos (Para la pantalla "Mis Proyectos")
// ==============================================================
router.get("/mis-proyectos/:idUsuario", (req, res) => {
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

    db.query(query, [idUsuario], (err, results) => {
        if (err) {
            console.error("Error DB:", err);
            return res.status(500).json({ error: "Error al obtener proyectos" });
        }
        res.json(results);
    });
});

// ==============================================================
// RUTA 2: Verificar Rol (Para la pantalla "Planificación")
// ==============================================================
router.get("/proyecto/:idProyecto/usuario/:idUsuario", (req, res) => {
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

    db.query(query, [idUsuario, idProyecto], (err, results: any) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: "Error DB" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }
        res.json(results[0]);
    });
});

// ==============================================================
// RUTA 3: Obtener Miembros del Equipo (Para el select de tareas)
// ==============================================================
router.get("/proyecto/:idProyecto/miembros", (req, res) => {
    const { idProyecto } = req.params;

    const query = `
        SELECT 
            u.id_usuario,
            u.nombre,
            u.apellido,
            me.rol_en_equipo  /* <--- ¡ESTO FALTABA! */
        FROM Proyectos p
        JOIN Miembros_Equipo me ON p.id_equipo = me.id_equipo
        JOIN Usuarios u ON me.id_usuario = u.id_usuario
        WHERE p.id_proyecto = ?
    `;

    db.query(query, [idProyecto], (err, results) => {
        if (err) return res.status(500).json({ error: "Error al obtener miembros" });
        res.json(results);
    });
});

// ==============================================================
// RUTA 4: CREAR NUEVO PROYECTO (ESTA ES LA QUE TE FALTA)
// ==============================================================
router.post("/proyectos", (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, id_usuario } = req.body;

    // 1. Primero creamos el Equipo 
    const queryEquipo = "INSERT INTO Equipos (nombre_equipo) VALUES (?)";

    db.query(queryEquipo, [nombre], (err, resultEq: any) => {
        if (err) return res.status(500).json({ error: "Error creando equipo" });

        const idEquipo = resultEq.insertId;

        // 2. Creamos el Proyecto
        const queryProy = `
            INSERT INTO Proyectos (nombre, descripcion, fecha_inicio, fecha_fin, id_jefe, id_equipo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(queryProy, [nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, idEquipo], (errProy, resultProy) => {
            if (errProy) return res.status(500).json({ error: "Error creando proyecto" });

            // 3. Agregamos al usuario como Líder
            const queryMiembro = `
                INSERT INTO Miembros_Equipo (id_equipo, id_usuario, rol_en_equipo)
                VALUES (?, ?, 'Líder de Proyecto')
            `;

            db.query(queryMiembro, [idEquipo, id_usuario], (errMiembro) => {
                if (errMiembro) return res.status(500).json({ error: "Error asignando líder" });
                res.json({ message: "Proyecto creado exitosamente" });
            });
        });
    });
});

// ==============================================================
// RUTA 5: VER PROYECTOS DISPONIBLES (Para unirse)
// ==============================================================
router.get("/proyectos/otros/:idUsuario", (req, res) => {
    const { idUsuario } = req.params;
    const query = `
        SELECT p.id_proyecto, p.nombre, p.descripcion, u.nombre as nombre_jefe 
        FROM Proyectos p
        JOIN Usuarios u ON p.id_jefe = u.id_usuario
        WHERE p.id_equipo NOT IN (
            SELECT id_equipo FROM Miembros_Equipo WHERE id_usuario = ?
        )
    `;
    db.query(query, [idUsuario], (err, results) => {
        if (err) return res.status(500).json({ error: "Error buscando proyectos" });
        res.json(results);
    });
});

// ==============================================================
// RUTA 6: SOLICITAR UNIRSE 
// ==============================================================
router.post("/proyectos/solicitar-union", (req, res) => {
    const { id_proyecto, id_usuario_solicitante } = req.body;

    const queryDatos = `
        SELECT p.id_jefe, p.nombre as nombre_proyecto, u.nombre, u.apellido 
        FROM Proyectos p
        JOIN Usuarios u ON u.id_usuario = ? 
        WHERE p.id_proyecto = ?
    `;

    db.query(queryDatos, [id_usuario_solicitante, id_proyecto], (err, results: any) => {
        if (err || results.length === 0) return res.status(500).json({ error: "Error datos" });

        const { id_jefe, nombre, apellido, nombre_proyecto } = results[0];
        const contenido = `${nombre} ${apellido} ha solicitado unirse a tu proyecto "${nombre_proyecto}"`;

        const queryNoti = `
            INSERT INTO Notificaciones (id_usuario_destino, id_tipo_notificacion, contenido, id_proyecto, id_usuario_remitente)
            VALUES (?, 4, ?, ?, ?)
        `;

        db.query(queryNoti, [id_jefe, contenido, id_proyecto, id_usuario_solicitante], (errNoti) => {
            if (errNoti) return res.status(500).json({ error: "Error enviando solicitud" });
            res.json({ message: "Solicitud enviada al líder" });
        });
    });
});

// ==============================================================
// RUTA 7: ACEPTAR SOLICITUD DE UNIÓN
// ==============================================================
router.post("/proyectos/aceptar-union", (req, res) => {
    const { id_proyecto, id_usuario_nuevo } = req.body;

    // Insertar en Miembros_Equipo
    const query = `
        INSERT INTO Miembros_Equipo (id_equipo, id_usuario, rol_en_equipo)
        SELECT id_equipo, ?, 'Integrante' 
        FROM Proyectos WHERE id_proyecto = ?
    `;

    db.query(query, [id_usuario_nuevo, id_proyecto], (err, result) => {
        if (err) {
            // Si ya existe (error duplicado), no pasa nada, devolvemos éxito igual
            if ((err as any).code === 'ER_DUP_ENTRY') {
                return res.json({ message: "El usuario ya era miembro" });
            }
            return res.status(500).json({ error: "Error aceptando miembro" });
        }
        res.json({ message: "Usuario aceptado en el equipo" });
    });
});



export default router;