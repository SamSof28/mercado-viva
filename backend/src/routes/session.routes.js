const { Router } = require('express');
const { iniciarSesion, obtenerSesion } = require('../controllers/session.controller');

const router = Router();
router.post('/', iniciarSesion);
router.get('/', obtenerSesion);

module.exports = router;