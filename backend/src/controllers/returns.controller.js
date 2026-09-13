const ReturnsService = require('../services/returns.services');

const consultarPedido = async (req, res) => {
    try {
        const { codigo_retorno } = req.params;
        const pedido = await ReturnsService.obtenerPedidoPorCodigo(codigo_retorno);
        return res.status(200).json({ exito: true, datos: pedido });
    } catch (error) {
        const statusCode = error.status || 500;
        return res.status(statusCode).json({ error: error.message }); // Cumple con el PR
    }
};

const calcularDevolucion = async (req, res) => {
    try {
        const { codigo_retorno } = req.params; 
        const { productos } = req.body; 
        
        const calculos = await ReturnsService.calcularMontos(codigo_retorno, productos);
        return res.status(200).json(calculos);
    } catch (error) {
        const statusCode = error.status || 500;
        return res.status(statusCode).json({ error: error.message });
    }
};

const procesarReembolso = async (req, res) => {
    try {
        const { codigo_retorno } = req.params;
        const datosReembolso = req.body;
        
        const resultado = await ReturnsService.ejecutarReembolso(codigo_retorno, datosReembolso);
        return res.status(200).json(resultado);
    } catch (error) {
        const statusCode = error.status || 500;
        return res.status(statusCode).json({ error: error.message });
    }
};

module.exports = { consultarPedido, calcularDevolucion, procesarReembolso };