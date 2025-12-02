import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Zap, Bot, User, 
    BarChart2, AlertTriangle, Calendar, CheckSquare, FileText, ChevronDown 
} from 'lucide-react'; 
import './ChatFlotante.css';

// Interfaz para los proyectos
interface Project {
    id_proyecto: number;
    nombre: string;
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const SUGGESTIONS = [
    { text: "Estado del proyecto", icon: <BarChart2 size={14} /> },
    { text: "¿Hay riesgos?", icon: <AlertTriangle size={14} /> },
    { text: "Próximas entregas", icon: <Calendar size={14} /> },
    { text: "Mis tareas", icon: <CheckSquare size={14} /> },
    { text: "Resumen ejecutivo", icon: <FileText size={14} /> }
];

const ChatFlotante: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hola, soy DOUE. Por favor, selecciona un proyecto para un análisis en tiempo real.", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    
    // 👇 NUEVOS ESTADOS PARA LA SELECCIÓN
    const [proyectos, setProyectos] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number>(0); // 0 = Global (Sin Proyecto)

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
    useEffect(() => { scrollToBottom(); }, [messages, isOpen, isTyping]);

    // 👇 LÓGICA DE CARGA DE PROYECTOS
    useEffect(() => {
        // Asumiendo que existe un endpoint simple para los proyectos del usuario
        fetch('http://localhost:3000/api/proyectos') 
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProyectos(data);
                }
            })
            .catch(err => console.error("Error al cargar proyectos para el selector:", err));
    }, []); 

    const sendMessage = async (texto: string) => {
        if (!texto.trim()) return;

        const userMsg: Message = { id: Date.now(), text: texto, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        // Si es global, el backend no buscará en la BD, lo cual es correcto para preguntas generales.
        const projectToSend = selectedProjectId === 0 ? null : selectedProjectId;

        try {
            const response = await fetch('http://localhost:3000/api/asistente/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    mensaje: texto,
                    idProyecto: projectToSend // Envía NULL o el ID
                })
            });

            const data = await response.json();
            const botMsg: Message = { 
                id: Date.now() + 1, 
                text: data.reply || "No pude procesar la respuesta.", 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Error chat:", error);
            setMessages(prev => [...prev, { id: Date.now(), text: "Error de conexión 🔌. Servidor no encontrado.", sender: 'bot' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') sendMessage(inputText);
    };

    return (
        <>
            {/* BOTÓN FLOTANTE */}
            {!isOpen && (
                <button className="chat-bubble-btn" onClick={() => setIsOpen(true)}>
                    <Sparkles color="white" size={28} strokeWidth={2} />
                </button>
            )}

            {/* VENTANA CHAT */}
            {isOpen && (
                <div className="chat-window">
                    
                    {/* CABECERA */}
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <h3><Zap size={18} fill="white" /> Asistente DOUE</h3>
                            <p>Inteligencia Artificial Activa</p>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>
                    
                    {/* 👇 BARRA DE SELECCIÓN DE PROYECTO */}
                    <div style={{ padding: '10px 20px', background: '#fcfcfc', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ position: 'relative' }}>
                            <select 
                                value={selectedProjectId}
                                onChange={(e) => {
                                    setSelectedProjectId(Number(e.target.value));
                                    setMessages([
                                        { id: Date.now(), text: `Cambiando el contexto a: ${e.target.value === '0' ? 'Global' : e.target.options[e.target.selectedIndex].text}...`, sender: 'bot' }
                                    ]);
                                }}
                                style={{
                                    width: '100%', appearance: 'none', background: 'white', border: '1px solid #cbd5e1',
                                    padding: '6px 10px', borderRadius: '8px', fontSize: '13px',
                                    fontWeight: 500, color: selectedProjectId === 0 ? '#ef4444' : '#334155', cursor: 'pointer', outline: 'none'
                                }}
                            >
                                <option value={0}>🌐 Global (Preguntas generales)</option>
                                {proyectos.map(p => (
                                    <option key={p.id_proyecto} value={p.id_proyecto}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: 10, color: '#64748b', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    {/* MENSAJES */}
                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-row ${msg.sender}`}>
                                {msg.sender === 'bot' && (
                                    <div className="bot-avatar"><Bot size={16} /></div>
                                )}
                                <div className={`message ${msg.sender}`}>
                                    {msg.text.split('\n').map((line, i) => (
                                        <span key={i}>{line}<br /></span>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="typing-indicator">
                                <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* BARRA DE SUGERENCIAS */}
                    <div className="suggestions-container">
                        {SUGGESTIONS.map((sug, i) => (
                            <button 
                                key={i} 
                                className="suggestion-chip"
                                onClick={() => sendMessage(sug.text)}
                                disabled={isTyping}
                            >
                                {sug.icon}
                                {sug.text}
                            </button>
                        ))}
                    </div>

                    {/* INPUT */}
                    <div className="chat-input-area">
                        <input 
                            type="text" 
                            className="chat-input" 
                            placeholder={selectedProjectId === 0 ? "Pregunta general..." : "Pregunta sobre el proyecto..."}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isTyping}
                            autoFocus
                        />
                        <button className="send-btn" onClick={() => sendMessage(inputText)} disabled={!inputText.trim() || isTyping}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatFlotante;