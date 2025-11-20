import React from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';

const CrearProyecto = () => {
  return (
    <DashboardLayout>
      <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div style={{ 
          flex: 2, 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #E5E7EB'
        }}>
          
          <Input label="Nombre del Proyecto" placeholder="Ej: Desarrollo de App Móvil" />

          <Select label="Tipo de Proyecto" options={['Desarrollo de Software', 'Marketing', 'Infraestructura', 'Consultoría']} />

          {/* Fila Flex para Tamaño y Complejidad */}
          <div style={{ display: 'flex', gap: '20px' }}>
              <Select label="Tamaño" options={['Pequeño', 'Mediano', 'Grande']} />
              <Select label="Complejidad" options={['Baja', 'Media', 'Alta']} />
          </div>

          {/* TextArea Descripción */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', fontSize: '14px', color: '#374151', display: 'block', marginBottom: '8px' }}>Descripción y Contexto</label>
            <textarea 
              placeholder="Describe los objetivos, requisitos y contexto del proyecto..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                minHeight: '100px',
                resize: 'vertical',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Caja IA Recomendación */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              fontWeight: 'bold', 
              fontSize: '14px', 
              background: 'linear-gradient(90deg, #9333ea, #531d84)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              marginBottom: '8px'
            }}>
              ✨ IA recomendación
            </label>
            <div style={{
              padding: '15px',
              border: '1px solid #D8B4FE',
              borderRadius: '8px',
              backgroundColor: '#FAF5FF', // Fondo morado muy claro
              color: '#6B7280',
              fontSize: '14px'
            }}>
              Basado en tus datos te recomendaremos una Metodología para tu caso...
            </div>
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <button style={{
              padding: '12px 32px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              color: '#374151'
            }}>
              Cancelar
            </button>
            
            <button style={{
              padding: '12px 32px',
              borderRadius: '8px',
              backgroundColor: '#0F172A', // Dark Slate
              color: 'white',
              cursor: 'pointer',
              border: 'none',
              fontWeight: '600'
            }}>
              Crear Proyecto
            </button>
          </div>

        </div>

        {/* COLUMNA DERECHA: ROBOT / MARKETING */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '40px' }}>
           
           <div style={{ 
             background: 'linear-gradient(90deg, #dd9d52 0%, #9333ea 100%)',
             padding: '15px 30px',
             borderRadius: '20px 20px 0 20px',
             color: 'white',
             textAlign: 'center',
             marginBottom: '20px',
             boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.3)'
           }}>
             <h3 style={{ margin: 0, fontSize: '18px' }}>Hola, me llamo DOUE</h3>
             <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>déjame ayudarte</p>
           </div>
           
           {/* Imagen del Robot (Pon tu imagen real en public) */}
           <div style={{ width: '300px', height: '300px' }}>
             {/* Usa tu imagen real aquí. Si no tienes, usa este placeholder */}
             <img 
                src="https://cdn3d.iconscout.com/3d/premium/thumb/robot-assistant-5230179-4395992.png" 
                alt="Robot AI" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
             />
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CrearProyecto;