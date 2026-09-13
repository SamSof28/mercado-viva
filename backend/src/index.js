const express = require('express');
const cors = require('cors'); 
const returnsRoutes = require('./routes/returns.routes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

app.use('/api/returns', returnsRoutes); 

app.get('/api/session', (req, res) => {
    return res.json({
        storeName: 'Sucursal configurada',
        register: 'Caja POS',
        shift: 'Turno actual',
        posVersion: 'v1.0.0',
        cashier: { id: 'local', name: 'Cajero POS', role: 'Cajero' },
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo exitosamente en http://localhost:${PORT}`);
    });
}

module.exports = app;