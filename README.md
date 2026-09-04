# 🛒 MVP Mercado Viva - Sistema de Devoluciones Omnicanal

## 📖 Descripción del Proyecto
Mercado Viva es una cadena de supermercados que actualmente enfrenta graves cuellos de botella operativos y frustración en los clientes debido a la incapacidad de gestionar devoluciones de pedidos digitales en sus canales físicos. 

Este Producto Mínimo Viable (MVP) propone una solución de logística inversa. Conecta una interfaz para el cliente digital con una herramienta intuitiva en el Punto de Venta (POS) para el cajero. 

**Objetivo Principal:** Procesar devoluciones digitales de manera presencial, garantizando la consistencia de datos y el principio de "Dato Único" en el inventario.

## 🛠️ Stack Tecnológico
* **Frontend:** React (TSX/JSX) + Tailwind CSS
* **Backend:** Node.js + Express
* **Base de Datos:** Supabase (PostgreSQL)
* **Despliegue:** Vercel

## 🚀 Guía de Instalación y Uso para el Equipo

Para correr este proyecto en tu entorno local, asegúrate de tener instalado [Node.js](https://nodejs.org/) y Git.

### 1. Clonar el repositorio
```bash
git clone [https://github.com/SamSof28/mercado-viva.git](https://github.com/SamSof28/mercado-viva.git)
cd mercado-viva
```


### 2. Configurar el Backend (Node.js/Express)

Abre una terminal y navega a la carpeta del backend:

```bash
cd backend
npm install
```

Crea un archivo `.env` en la raíz de la carpeta `backend` y añade las credenciales de Supabase proporcionadas por el equipo:

```env
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_anon_key
PORT=3000
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

*El backend estará corriendo en http://localhost:3000*

### 3. Configurar el Frontend (React/Vite)

Abre una **nueva** terminal (manteniendo el backend corriendo) y navega a la carpeta del frontend:

```bash
cd frontend
npm install
```

Crea un archivo `.env` en la raíz de la carpeta `frontend` para conectar con la API local:

```env
VITE_API_URL=http://localhost:3000
```

Inicia la aplicación de React:

```bash
npm run dev
```

*El frontend estará corriendo en http://localhost:5173*

