const { Router } = require('express');
const { obtenerPedido, crearSolicitud } = require('../controllers/client.controller');

const router = Router();
router.get('/get_request', obtenerPedido);
router.post('/create_return', crearSolicitud);

module.exports = router;