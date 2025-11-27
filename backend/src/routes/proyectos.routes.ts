import { Router } from "express";
import { db } from "../config/db.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const router = Router();

// ==============================================================
// RUTA 1: Obtener lista de proyectos (Para "Mis Proyectos")
// ==============================================================
router.get("/mis-proyectos/:idUsuario", async (req, res) => {
    const { idUsuario } = req.params;

    // Esta consulta hace lo siguiente:
    // 1. Obtiene los proyectos donde el usuario es miembro.
    // 2. Hace JOIN con usuarios para obtener el nombre del Jefe.
    // 3. Calcula si el usuario es "Líder" o "Colaborador".
    // 4. Calcula el estado (Activo/Finalizado) según la fecha de fin.
    // 5. Cuenta cuántos miembros tiene el equipo (subconsulta).
    const query = `
        SELECT 
            p.id_proyecto,
            p.nombre,
            p.descripcion,
            p.fecha_inicio,
            p.fecha_fin,
            IF(p.id_jefe = ?, 'Líder', 'Colaborador') AS rol,
            CONCAT(u.nombre, ' ', u.apellido) AS nombre_jefe,
            IF(p.fecha_fin < CURDATE(), 'Finalizado', 'Activo') AS estado_calculado,
            (SELECT COUNT(*) FROM miembros_equipo me WHERE me.id_equipo = p.id_equipo) as cantidad_miembros
        FROM proyectos p
        JOIN equipos e ON p.id_equipo = e.id_equipo
        JOIN miembros_equipo me_propio ON me_propio.id_equipo = e.id_equipo
        JOIN usuarios u ON p.id_jefe = u.id_usuario
        WHERE me_propio.id_usuario = ?
    `;

    try {
        // Pasamos idUsuario dos veces (una para verificar rol, otra para filtrar)
        const [results] = await db.query(query, [idUsuario, idUsuario]);
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
// RUTA 4: CREAR NUEVO PROYECTO + TAREAS IA (FINAL)
// ==============================================================
router.post("/proyectos", async (req, res) => {
    // 1. Recibimos 'tareas' (array de strings) además de lo demás
    const { 
        nombre, descripcion, fecha_inicio, fecha_fin, 
        id_jefe, tipo, tamano, complejidad, metodologia_id,
        tareas // <--- Lista de tareas sugeridas por la IA
    } = req.body;
    
    const idLider = id_jefe || 1; 
    const connection = await db.getConnection(); 

    try {
        await connection.beginTransaction();

        // --- PASO A: CREAR EQUIPO ---
        const [resultEq] = await connection.query<ResultSetHeader>(
            "INSERT INTO Equipos (nombre_equipo) VALUES (?)", 
            [nombre]
        );
        const idEquipo = resultEq.insertId;

        // --- PASO B: CREAR PROYECTO ---
        const [resultProj] = await connection.query<ResultSetHeader>(
            `INSERT INTO Proyectos (
                nombre, descripcion, fecha_inicio, fecha_fin, 
                id_jefe, id_equipo, 
                tipo, tamano, complejidad, metodologia_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre, descripcion, fecha_inicio, fecha_fin, 
                idLider, idEquipo, 
                tipo || "Otro", tamano || "Mediano", complejidad || "Media", metodologia_id || null
            ]
        );
        const idNuevoProyecto = resultProj.insertId;

        // --- PASO C: ASIGNAR LÍDER ---
        await connection.query(
            `INSERT INTO Miembros_Equipo (id_equipo, id_usuario, rol_en_equipo)
             VALUES (?, ?, 'Líder de Proyecto')`,
            [idEquipo, idLider]
        );

        // --- PASO D: INSERTAR TAREAS DE LA IA (SIN ASIGNAR) ---
        if (tareas && Array.isArray(tareas) && tareas.length > 0) {
            // Calculamos fechas por defecto para las tareas (ej: inician hoy, terminan en 7 días)
            // Esto permite que aparezcan en el calendario, luego el usuario las ajusta.
            const fechaTareaInicio = fecha_inicio; 
            // Truco: Sumamos 7 días a la fecha de inicio para tener una fecha fin por defecto
            const fechaObj = new Date(fecha_inicio);
            fechaObj.setDate(fechaObj.getDate() + 7);
            const fechaTareaFin = fechaObj.toISOString().split('T')[0];

            for (const tituloTarea of tareas) {
                await connection.query(
                    `INSERT INTO Tareas (
                        id_proyecto, titulo, descripcion, 
                        fecha_inicio, fecha_fin, 
                        id_responsable
                    ) VALUES (?, ?, ?, ?, ?, NULL)`, // NULL = Sin asignar (Botón "Asignar a" aparecerá)
                    [
                        idNuevoProyecto, 
                        tituloTarea, 
                        "Tarea sugerida por IA", // Descripción genérica
                        fechaTareaInicio, 
                        fechaTareaFin
                    ]
                );
            }
        }

        await connection.commit();
        res.json({ message: "Proyecto y tareas creados exitosamente" });

    } catch (error) {
        await connection.rollback();
        console.error("❌ Error creando proyecto:", error);
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

// RUTA: Asignar un miembro a una tarea
router.put("/tareas/:idTarea/asignar", async (req, res) => {
    const { idTarea } = req.params;
    const { id_usuario } = req.body; // El ID del miembro que seleccionaste en el dropdown

    try {
        await db.query(
            "UPDATE Tareas SET id_responsable = ? WHERE id_tarea = ?",
            [id_usuario, idTarea]
        );
        res.json({ message: "Tarea asignada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al asignar tarea" });
    }
});

//==============================================================
// RUTA 8: EDITAR PROYECTO (PUT)
// ==============================================================
router.put("/proyectos/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;

    try {
        await db.query(
            "UPDATE proyectos SET nombre=?, descripcion=?, fecha_inicio=?, fecha_fin=? WHERE id_proyecto=?",
            [nombre, descripcion, fecha_inicio, fecha_fin, id]
        );
        res.json({ message: "Proyecto actualizado correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al actualizar proyecto" });
    }
});

// ==============================================================
// RUTA 9: CAMBIAR ESTADO (Finalizar/Activar)
// ==============================================================
router.put("/proyectos/:id/estado", async (req, res) => {
    const { id } = req.params;
    const { accion } = req.body; // 'finalizar' o 'activar'

    try {
        let query = "";
        
        if (accion === 'finalizar') {
            // Para finalizar, ponemos la fecha fin a AYER
            query = "UPDATE proyectos SET fecha_fin = DATE_SUB(CURDATE(), INTERVAL 1 DAY) WHERE id_proyecto = ?";
        } else {
            // Para activar, ponemos la fecha fin a 3 meses en el futuro (o null si prefieres indefinido)
            query = "UPDATE proyectos SET fecha_fin = DATE_ADD(CURDATE(), INTERVAL 3 MONTH) WHERE id_proyecto = ?";
        }

        await db.query(query, [id]);
        res.json({ message: `Proyecto ${accion === 'finalizar' ? 'finalizado' : 'activado'} correctamente` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al cambiar estado" });
    }
});

export default router;