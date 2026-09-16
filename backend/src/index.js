const express = require('express');
const cors = require('cors'); 
const returnsRoutes = require('./routes/returns.routes'); 
const sessionRoutes = require('./routes/session.routes');
const clientRoutes = require('./routes/client.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

app.use('/api/returns', returnsRoutes); 
app.use('/api/session', sessionRoutes);
app.use('/api', clientRoutes);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo exitosamente en http://localhost:${PORT}`);
    });
}

module.exports = app;