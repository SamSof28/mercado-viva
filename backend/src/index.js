const express = require('express');
const cors = require('cors'); 
const returnsRoutes = require('./routes/returns.routes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 

app.use('/api/returns', returnsRoutes); 

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo exitosamente en http://localhost:${PORT}`);
});