const supabase = require('../config/supabase');
const { serviceFactory } = require('../services/client.services');

const clientService = serviceFactory(supabase);

const obtenerPedido = async (req, res) => {
    try {
        return res.status(200).json(await clientService.obtenerPedido(req.query.clientId));
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message || 'Error al obtener el pedido.' });
    }
};

const crearSolicitud = async (req, res) => {
    try {
        return res.status(200).json(await clientService.crearSolicitud(req.body));
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message || 'Error al crear la devolución.' });
    }
};

module.exports = { obtenerPedido, crearSolicitud };