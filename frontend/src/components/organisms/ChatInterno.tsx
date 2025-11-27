import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import './ChatInterno.css';

interface Props {
    idProyecto?: string;
}

interface Mensaje {
    id_mensaje: number;
    mensaje: string;
    id_usuario: number;
    nombre: string;
    apellido: string;
    fecha_envio: string;
}

const ChatInterno: React.FC<Props> = ({ idProyecto }) => {
    const { usuario } = useUser();
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [miembros, setMiembros] = useState<any[]>([]);
    const [infoProyecto, setInfoProyecto] = useState<any>(null);

    const [chatActivo, setChatActivo] = useState<'GENERAL' | number>('GENERAL');
    const messagesEndRef = useRef<HTMLDivElement>(null);


    // Creamos esta variable auxiliar
    const miId = (usuario as any)?.id || usuario?.id_usuario;

    // NUEVO: Ref para saber si acabamos de cambiar de chat
    const isChatChanged = useRef(false);

    // 1. Cargar Datos Iniciales
    useEffect(() => {
        if (idProyecto && miId) {
            fetch(`http://localhost:3000/api/proyecto/${idProyecto}/miembros`)
                .then(res => res.json())
                .then(data => setMiembros(data));

            // CORRECCIÓN AQUÍ: Cambiamos ${usuario.id_usuario} por ${miId}
            fetch(`http://localhost:3000/api/proyecto/${idProyecto}/usuario/${miId}`)
                .then(res => res.json())
                .then(data => setInfoProyecto(data));
        }
    }, [idProyecto, miId]);

    // NUEVO: Detectar cuando cambiamos de chat para forzar el scroll abajo
    useEffect(() => {
        isChatChanged.current = true;
        cargarMensajes();
    }, [chatActivo, idProyecto]); // Se ejecuta al cambiar de chat

    const cargarMensajes = () => {
        if (!usuario || !idProyecto) return;

        let url = "";
        if (chatActivo === 'GENERAL') {
            url = `http://localhost:3000/api/chat/${idProyecto}/general`;
        } else {
            // CORRECCIÓN AQUÍ: Cambiamos usuario.id_usuario por miId
            url = `http://localhost:3000/api/chat/${idProyecto}/privado/${miId}/${chatActivo}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => setMensajes(data))
            .catch(err => console.error(err));
    };

    // Intervalo de Polling (Recarga automática)
    useEffect(() => {
        const intervalo = setInterval(cargarMensajes, 2000);
        return () => clearInterval(intervalo);
    }, [chatActivo, idProyecto, usuario]);

    // 2. SCROLL INTELIGENTE (LA SOLUCIÓN A TU PROBLEMA)
    useEffect(() => {
        const container = messagesEndRef.current?.parentElement;
        if (!container) return;

        // CASO A: Acabamos de entrar al chat -> Bajamos de golpe
        if (isChatChanged.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
            isChatChanged.current = false; // Ya no es nuevo
            return;
        }

        // CASO B: Estamos recargando mensajes (Polling)
        // Calculamos si el usuario está "cerca" del final (menos de 150px)
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

        // Si está cerca del final, bajamos suave para mostrar lo nuevo.
        // Si NO está cerca (está leyendo arriba), NO HACEMOS NADA.
        if (isNearBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }

    }, [mensajes]);

    // 3. Enviar Mensaje
    const handleEnviar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || !usuario || !idProyecto) return;

        // CORRECCIÓN: Usamos el ID real
        const miId = (usuario as any)?.id || usuario?.id_usuario;

        const payload: any = {
            id_proyecto: idProyecto,
            id_usuario: miId, // <--- CORREGIDO
            mensaje: nuevoMensaje
        };

        if (chatActivo !== 'GENERAL') payload.id_destinatario = chatActivo;

        fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(() => {
            setNuevoMensaje("");
            // Al enviar, forzamos que baje el scroll poniendo la bandera en true
            isChatChanged.current = true;
            cargarMensajes();
        });
    };



    const getHeaderInfo = () => {
        if (chatActivo === 'GENERAL') {
            return {
                titulo: "Canal General",
                subtitulo: infoProyecto ? `Proyecto: ${infoProyecto.nombre}` : "Todos los miembros",
                avatar: "#"
            };
        } else {
            const miembro = miembros.find(m => m.id_usuario === chatActivo);
            return {
                titulo: miembro ? `${miembro.nombre} ${miembro.apellido}` : "Usuario",
                subtitulo: miembro ? `${miembro.rol_en_equipo}` : "Chat Privado",
                avatar: miembro ? miembro.nombre.charAt(0) : "?"
            };
        }
    };

    const headerInfo = getHeaderInfo();

    return (
        <>
            <div className='containerproychat'>
                <div className="chat-layout">
                    <div className="chat-sidebar">
                        <div className="sidebar-header" style={{ color: '#2563eb' }}>Canales</div>
                        <div
                            className={`member-item ${chatActivo === 'GENERAL' ? 'channel-active' : ''}`}
                            onClick={() => setChatActivo('GENERAL')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src="/chat.png" width="30" alt="#" />
                            <div>
                                <strong>Canal General</strong>
                                <br /><span style={{ fontSize: '12px', color: '#888' }}>Todos los miembros</span>
                            </div>
                        </div>

                        <div className="sidebar-header" style={{ marginTop: 'auto', borderTop: '1px solid #ddd', fontSize: '13px', color: '#999' }}>
                            Mensajes Directos
                        </div>

                        <div className="members-list">
                            {miembros
                                // CORRECCIÓN: Usamos miId (que definimos al principio del componente)
                                .filter(m => String(m.id_usuario) !== String(miId))
                                .map(m => (
                                    <div
                                        key={m.id_usuario}
                                        className={`member-item ${chatActivo === m.id_usuario ? 'channel-active' : ''}`}
                                        onClick={() => setChatActivo(m.id_usuario)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div style={{ width: '30px', height: '30px', background: chatActivo === m.id_usuario ? '#2563eb' : '#ddd', color: chatActivo === m.id_usuario ? 'white' : 'black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', fontSize: '12px' }}>
                                            {m.nombre.charAt(0)}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '14px' }}>{m.nombre} {m.apellido}</span>
                                            <span style={{ fontSize: '10px', color: '#aaa' }}>{m.rol_en_equipo}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="chat-main">
                        <div className="chat-main-header">
                            <div className="header-avatar" style={{ background: chatActivo === 'GENERAL' ? '#ddd' : '#2563eb', color: chatActivo === 'GENERAL' ? '#555' : 'white' }}>
                                {chatActivo === 'GENERAL' ? <img src="/chat.png" width="20" /> : headerInfo.avatar}
                            </div>
                            <div className="header-info">
                                <h4>{headerInfo.titulo}</h4>
                                <span>{headerInfo.subtitulo}</span>
                            </div>
                        </div>

                        <div className="messages-area">
                            {mensajes.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
                                    {chatActivo === 'GENERAL' ? 'Bienvenido al canal general.' : 'Inicia la conversación...'}
                                </p>
                            )}

                            {mensajes.map(msg => {
                                const miIdReal = (usuario as any)?.id || usuario?.id_usuario;
                                const esMio = String(msg.id_usuario) === String(miIdReal);
                                return (
                                    <div key={msg.id_mensaje} className={`message-bubble ${esMio ? 'msg-mine' : 'msg-other'}`}>                                        {!esMio && <span className="msg-sender">{msg.nombre} {msg.apellido}</span>}
                                        {msg.mensaje}
                                        <span style={{ fontSize: '10px', color: '#999', float: 'right', marginLeft: '10px', marginTop: '5px' }}>
                                            {new Date(msg.fecha_envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleEnviar}>
                            <input
                                type="text"
                                name="mensaje"
                                id="input-mensaje"
                                className="chat-input"
                                placeholder="Escribe un mensaje..."
                                value={nuevoMensaje}
                                onChange={(e) => setNuevoMensaje(e.target.value)}
                                autoComplete="off"
                            />
                            <button type="submit" className="btn-send">➤</button>
                        </form>
                    </div>
                </div>

            </div>


        </>
    )
}

export default ChatInterno;