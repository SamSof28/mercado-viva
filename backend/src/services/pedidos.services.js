const supabase = require('../config/supabase'); 

const obtenerPedidoPorCodigo = async (codigoRetorno) => {
    // 1. Consulta real a PostgreSQL en Supabase
    const { data: pedido, error } = await supabase
        .from('pedidos_web')
        .select(`
            id_pedido, 
            estado, 
            fecha_compra,
            detalle_pedido (
                id_producto,
                cantidad_comprada,
                precio_unitario,
                productos ( nombre, sku, es_devoluble )
            )
        `)
        .eq('codigo_retorno', codigoRetorno)
        .single(); // Esperamos un solo resultado, ya que el código es único

    // 2. Manejo de Errores de Base de Datos
    if (error || !pedido) {
        const err = new Error("El pedido no existe en el sistema.");
        err.status = 404;
        throw err;
    }

    // 3. Reglas de Negocio de Mercado Viva
    if (pedido.estado === "devuelto") {
        const err = new Error("Este pedido ya fue procesado para devolución.");
        err.status = 400; 
        throw err;
    }

    // Retornamos el dato estructurado de la base de datos real
    return pedido;
};

module.exports = { obtenerPedidoPorCodigo };

