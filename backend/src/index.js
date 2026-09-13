const express = require('express');
// Importas las rutas que ya creaste
const pedidosRoutes = require('./routes/pedidos.routes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para que tu API entienda formato JSON
app.use(express.json());

// Conectamos tus rutas bajo el prefijo /api/pedidos
// Esto significa que tus rutas se consultarán en http://localhost:3000/api/pedidos/:codigo_retorno
app.use('/api/pedidos', pedidosRoutes);

// Iniciamos el servidor y mantenemos el proceso vivo en la terminal
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo exitosamente en http://localhost:${PORT}`);
});
