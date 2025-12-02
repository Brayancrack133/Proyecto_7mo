import React, { useState } from 'react';
import './ModalDesglose.css';

interface SubtareaIA {
    titulo: string;
    descripcion: string;
}

interface Props {
    tareaPadre: string;
    subtareas: SubtareaIA[];
    onCerrar: () => void;
    onConfirmar: (subtareasSeleccionadas: SubtareaIA[]) => void;
}

const ModalDesglose: React.FC<Props> = ({ tareaPadre, subtareas, onCerrar, onConfirmar }) => {
    // Por defecto todas seleccionadas
    const [seleccionadas, setSeleccionadas] = useState<number[]>(subtareas.map((_, i) => i));
    const [procesando, setProcesando] = useState(false);

    const toggleSeleccion = (index: number) => {
        if (seleccionadas.includes(index)) {
            setSeleccionadas(seleccionadas.filter(i => i !== index));
        } else {
            setSeleccionadas([...seleccionadas, index]);
        }
    };

    const handleGuardar = () => {
        setProcesando(true);
        const final = subtareas.filter((_, i) => seleccionadas.includes(i));
        onConfirmar(final);
    };

    return (
        <div className="modal-overlay-backdrop" onClick={onCerrar}>
            {/* stopPropagation evita que el click en el modal lo cierre */}
            <div className="modal-smart-container" onClick={(e) => e.stopPropagation()}>
                
                {/* CABECERA CON BARRA INFERIOR DE COLOR */}
                <div className="modal-header">
                    <h3>Desglose Inteligente de Tareas</h3>
                    <p className="header-subtitle">
                        La IA sugiere dividir <strong>"{tareaPadre}"</strong> en los siguientes pasos técnicos. 
                        <br/>
                        Selecciona los que deseas aplicar:
                    </p>
                </div>

                {/* LISTA ESCROLEABLE */}
                <div className="checklist-container">
                    {subtareas.map((sub, index) => {
                        const isSelected = seleccionadas.includes(index);
                        return (
                            <div 
                                key={index} 
                                className={`checklist-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleSeleccion(index)}
                            >
                                <div className="custom-checkbox">
                                    <span className="checkmark">✔</span>
                                </div>
                                
                                <div className="item-content">
                                    <span className="item-title">{sub.titulo}</span>
                                    <span className="item-desc">{sub.descripcion}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* BOTONES */}
                <div className="modal-footer">
                    <button onClick={onCerrar} className="btn-secondary" disabled={procesando}>
                        Cancelar
                    </button>
                    <button 
                        onClick={handleGuardar} 
                        className="btn-primary"
                        disabled={procesando || seleccionadas.length === 0}
                    >
                        {procesando ? 'Procesando...' : `Confirmar selección (${seleccionadas.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDesglose;