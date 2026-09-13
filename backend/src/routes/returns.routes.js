const { Router } = require('express');
const { consultarPedido, calcularDevolucion, procesarReembolso } = require('../controllers/returns.controller');
const router = Router();

// Endpoint GET: Para buscar el pedido
router.get('/:codigo_retorno', consultarPedido);

// Endpoint POST: Para hacer los cálculos financieros antes de confirmar
router.post('/:codigo_retorno/calculate', calcularDevolucion);

// Endpoint POST: Para confirmar y alterar la base de datos
router.post('/:codigo_retorno/refund', procesarReembolso);

router.post('/:codigo_retorno/reject', (req, res) => {
	return res.status(200).json({ success: true, message: 'Solicitud de devolución rechazada.' });
});

module.exports = router;