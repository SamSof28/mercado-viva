const PedidosService = require('../services/pedidos.services');

const consultarPedido = async (req, res) => {
    try {
        // 1. Extraer lo que pide el cajero
        const { codigo_retorno } = req.params;
        
        // 2. Mandar al servicio a hacer el trabajo pesado
        const pedido = await PedidosService.obtenerPedidoPorCodigo(codigo_retorno);
        
        // 3. Devolver la respuesta exitosa a React
        return res.status(200).json({ exito: true, datos: pedido });
    } catch (error) {
        // 4. Si el servicio lanza un error, lo atrapamos aquí
        const statusCode = error.status || 500;
        return res.status(statusCode).json({ exito: false, mensaje: error.message });
    }
};

module.exports = { consultarPedido };