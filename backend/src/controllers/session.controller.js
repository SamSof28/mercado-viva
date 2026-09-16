const supabase = require('../config/supabase');
const { serviceFactory } = require('../services/session.services');

const sessionService = serviceFactory(supabase);

const getBearerToken = (req) => {
    const header = req.get('authorization') || '';
    return header.startsWith('Bearer ') ? header.slice(7) : null;
};

const iniciarSesion = async (req, res) => {
    try {
        return res.status(200).json(await sessionService.iniciarSesion(req.body?.email, req.body?.password));
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message || 'Error al iniciar sesión.' });
    }
};

const obtenerSesion = (req, res) => {
    try {
        const session = sessionService.obtenerSesion(getBearerToken(req));
        return res.status(200).json({
            cashier: session.cashier,
            posId: session.posId,
            storeId: session.storeId,
            loginTime: session.loginTime,
            storeName: session.storeName,
            register: session.register,
            shift: session.shift,
            posVersion: session.posVersion,
        });
    } catch (error) {
        return res.status(error.status || 401).json({ error: error.message || 'Sesión de caja no válida o expirada.' });
    }
};

module.exports = { iniciarSesion, obtenerSesion };