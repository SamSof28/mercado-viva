const supabase = require('../config/supabase');

const ORDER_SELECT = `
    id_pedido, codigo_retorno, estado, fecha_compra, total_pagado,
    detalle_pedido (
        id_producto, cantidad_comprada, precio_unitario,
        productos ( nombre, sku, es_devoluble )
    )
`;

const serviceFactory = (database) => {
    const obtenerPedidoPorCodigo = async (codigoRetorno) => {
        if (!codigoRetorno || !codigoRetorno.trim()) {
            throw { status: 400, message: 'El código de devolución es obligatorio.' };
        }

        const { data: pedido, error } = await database
            .from('pedidos_web')
            .select(ORDER_SELECT)
            .eq('codigo_retorno', codigoRetorno.trim())
            .single();

        if (error || !pedido) throw { status: 404, message: 'El pedido no existe.' };
        if (pedido.estado === 'devuelto') throw { status: 400, message: 'Este pedido ya fue devuelto.' };

        return pedido;
    };

    const normalizarProductos = (pedido, productos = [], selectedItemIds = []) => {
        const requested = productos.length
            ? productos
            : selectedItemIds.map((id_producto) => ({ id_producto, cantidad_devuelta: 1 }));

        if (!Array.isArray(requested) || requested.length === 0) {
            throw { status: 400, message: 'Debe seleccionar al menos un producto.' };
        }

        return requested.map((item) => {
            const original = pedido.detalle_pedido.find((entry) => entry.id_producto === item.id_producto);
            const cantidad = Number(item.cantidad_devuelta);
            if (!original) throw { status: 400, message: 'Producto no pertenece al pedido.' };
            if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > original.cantidad_comprada) {
                throw { status: 400, message: 'La cantidad a devolver no es válida.' };
            }
            return { ...item, cantidad_devuelta: cantidad };
        });
    };

    const calcularMontos = async (codigoRetorno, body = {}) => {
        const pedidoOriginal = await obtenerPedidoPorCodigo(codigoRetorno);
        const productos = normalizarProductos(pedidoOriginal, body.productos, body.selectedItemIds);
        const subtotal = productos.reduce((total, item) => {
            const original = pedidoOriginal.detalle_pedido.find((entry) => entry.id_producto === item.id_producto);
            return total + Number(original.precio_unitario) * item.cantidad_devuelta;
        }, 0);
        const impuestos = Math.round(subtotal * 0.19);

        return {
            selectedCount: productos.reduce((total, item) => total + item.cantidad_devuelta, 0),
            subtotal,
            ivaAmount: impuestos,
            totalRefund: subtotal + impuestos,
            shippingCost: 0,
            isShippingRefundable: false,
            currency: 'CLP',
        };
    };

    const ejecutarReembolso = async (codigoRetorno, datosReembolso = {}) => {
        const { id_tienda, productos, selectedItemIds, refundMethod, globalReason } = datosReembolso;
        if (!id_tienda) throw { status: 400, message: 'La tienda que recibe la devolución es obligatoria.' };
        if (!refundMethod || !globalReason) throw { status: 400, message: 'El método y el motivo del reembolso son obligatorios.' };

        const pedido = await obtenerPedidoPorCodigo(codigoRetorno);
        const productosValidados = normalizarProductos(pedido, productos, selectedItemIds);
        const { error: errorUpdate } = await database
            .from('pedidos_web')
            .update({ estado: 'devuelto' })
            .eq('codigo_retorno', codigoRetorno);
        if (errorUpdate) throw { status: 500, message: 'Error al actualizar pedido.' };

        for (const item of productosValidados) {
            if (item.physicalStatus !== 'restock') continue;
            const { data: inventario, error: inventoryReadError } = await database
                .from('inventario_tienda')
                .select('stock_disponible')
                .eq('id_tienda', id_tienda)
                .eq('id_producto', item.id_producto)
                .single();
            if (inventoryReadError) throw { status: 500, message: 'Error al consultar inventario.' };
            if (!inventario) throw { status: 400, message: 'El producto no existe en el inventario de la tienda.' };

            const { error: inventoryUpdateError } = await database
                .from('inventario_tienda')
                .update({ stock_disponible: inventario.stock_disponible + item.cantidad_devuelta })
                .eq('id_tienda', id_tienda)
                .eq('id_producto', item.id_producto);
            if (inventoryUpdateError) throw { status: 500, message: 'Error al actualizar inventario.' };
        }

        return {
            success: true,
            transactionId: `RET-${pedido.id_pedido}`,
            refundedAmount: (await calcularMontos(codigoRetorno, { productos: productosValidados })).totalRefund,
            creditNoteNumber: null,
            message: 'Reembolso procesado y stock sincronizado.',
        };
    };

    return { obtenerPedidoPorCodigo, calcularMontos, ejecutarReembolso };
};

module.exports = { ...serviceFactory(supabase), serviceFactory };