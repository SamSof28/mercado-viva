const supabase = require('../config/supabase'); 

const obtenerPedidoPorCodigo = async (codigoRetorno) => {
    const { data: pedido, error } = await supabase
        .from('pedidos_web')
        .select(`
            id_pedido, estado, fecha_compra,
            detalle_pedido (
                id_producto, cantidad_comprada, precio_unitario,
                productos ( nombre, sku, es_devoluble )
            )
        `)
        .eq('codigo_retorno', codigoRetorno)
        .single(); 

    if (error || !pedido) throw { status: 404, message: "El pedido no existe." };
    if (pedido.estado === "devuelto") throw { status: 400, message: "Este pedido ya fue devuelto." };

    return pedido;
};

// NUEVO: Método para el endpoint /calculate
const calcularMontos = async (codigoRetorno, productosEnviados) => {
    const pedidoOriginal = await obtenerPedidoPorCodigo(codigoRetorno);
    let subtotal = 0;

    for (const itemDevuelto of productosEnviados) {
        // Busca el producto en la base de datos para ver a qué precio se vendió
        const itemOriginal = pedidoOriginal.detalle_pedido.find(
            (p) => p.id_producto === itemDevuelto.id_producto
        );

        if (!itemOriginal) throw { status: 400, message: "Producto no pertenece al pedido." };
        
        // Acumula el dinero multiplicando precio base por cantidad devuelta
        subtotal += (itemOriginal.precio_unitario * itemDevuelto.cantidad_devuelta);
    }

    const impuestos = subtotal * 0.19; // IVA del 19%
    return {
        subtotal: subtotal,
        impuestos: impuestos,
        total_reembolso: subtotal + impuestos
    };
};

// NUEVO: Método para el endpoint /refund
const ejecutarReembolso = async (codigoRetorno, datosReembolso) => {
    const { id_tienda, productos } = datosReembolso;
    
    // 1. Validación de seguridad
    await obtenerPedidoPorCodigo(codigoRetorno); 

    // 2. Actualizar estado del pedido web
    const { error: errorUpdate } = await supabase
        .from('pedidos_web')
        .update({ estado: 'devuelto' })
        .eq('codigo_retorno', codigoRetorno);

    if (errorUpdate) throw { status: 500, message: "Error al actualizar pedido." };

    // 3. Garantizar el Dato Único interactuando con el Inventario
    for (const item of productos) {
        // Solo reabastecemos el stock si el cajero indicó que el producto está bueno
        if (item.physicalStatus === 'restock') {
            const { data: inventario } = await supabase
                .from('inventario_tienda')
                .select('stock_disponible')
                .eq('id_tienda', id_tienda)
                .eq('id_producto', item.id_producto)
                .single();

            if (inventario) {
                await supabase
                    .from('inventario_tienda')
                    .update({ stock_disponible: inventario.stock_disponible + item.cantidad_devuelta })
                    .eq('id_tienda', id_tienda)
                    .eq('id_producto', item.id_producto);
            }
        }
    }

    return { exito: true, message: "Reembolso procesado y stock sincronizado." };
};

module.exports = { obtenerPedidoPorCodigo, calcularMontos, ejecutarReembolso };