# Sistema de Administración de Proyectos

Sistema full-stack para administración de proyectos construido con React + TypeScript + Node.js + MySQL.

## 🚀 Tecnologías

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- React Router DOM

### Backend
- Node.js
- Express
- TypeScript
- MySQL
- dotenv

## 📋 Requisitos previos

- Node.js v18 o superior
- MySQL 8.0 o superior
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/adm_proyecto.git
cd adm_proyecto
```

### 2. Configurar Backend
```bash
cd backend
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Configurar Frontend
```bash
cd ../frontend
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
```

### 4. Configurar Base de Datos
```sql
CREATE DATABASE nombre_base_datos;
-- Ejecutar las migraciones en backend/src/database/migrations/
```

## ▶️ Ejecución

### Backend
```bash
cd backend
npm run dev
# Servidor corriendo en http://localhost:3000
```

### Frontend
```bash
cd frontend
npm run dev
# Aplicación corriendo en http://localhost:5173
```

## 👥 Equipo

- [Tu Nombre] - Developer
- [Nombre Compañero] - Developer

## 📄 Licencia

Este proyecto es privado y de uso exclusivo del equipo.