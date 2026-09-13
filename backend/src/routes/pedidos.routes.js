const { Router } = require('express');
const { consultarPedido } = require('../controllers/pedidos.controller');
const router = Router();

// El parámetro dinámico está precedido por dos puntos (:)
router.get('/:codigo_retorno', consultarPedido);

module.exports = router;