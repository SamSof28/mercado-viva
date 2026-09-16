const ORDER_SELECT = `
    id_pedido, id_cliente, fecha_compra, estado, total_pagado, codigo_retorno,
    detalle_pedido (
        id_producto, cantidad_comprada, precio_unitario,
        productos ( nombre, sku, marca, imagen_url )
    )
`;

const formatDate = (date) => new Intl.DateTimeFormat('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(new Date(date));

const serviceFactory = (database) => {
    const findOrder = async (orderId, clientId) => {
        let query = database.from('pedidos_web').select(ORDER_SELECT).eq('id_pedido', orderId);
        if (clientId) query = query.eq('id_cliente', clientId);
        const { data, error } = await query.single();
        if (error || !data) throw { status: 404, message: 'El pedido no existe o no pertenece al cliente.' };
        return data;
    };

    return {
        async obtenerPedido(clientId) {
            if (!clientId || !String(clientId).trim()) throw { status: 400, message: 'clientId es obligatorio.' };
            const { data, error } = await database
                .from('pedidos_web')
                .select(ORDER_SELECT)
                .eq('id_cliente', String(clientId).trim())
                .order('fecha_compra', { ascending: false })
                .limit(1)
                .single();
            if (error || !data) throw { status: 404, message: 'No se encontraron pedidos para el cliente.' };
            return mapOrder(data);
        },

        async crearSolicitud(body = {}) {
            const { orderId, items, reason, method } = body;
            const validMethods = ['original_card', 'store_credit', 'cash'];
            if (!orderId || !Array.isArray(items) || !items.length || !reason || !validMethods.includes(method)) {
                throw { status: 400, message: 'orderId, items, reason y un método de reembolso válido son obligatorios.' };
            }

            const order = await findOrder(orderId);
            const requestedItems = items.map((item) => {
                const original = (order.detalle_pedido || []).find((entry) => entry.id_producto === item.id);
                const quantity = Number(item.quantity);
                if (!original || !Number.isInteger(quantity) || quantity < 1 || quantity > original.cantidad_comprada) {
                    throw { status: 400, message: 'Uno de los productos o cantidades no pertenece al pedido.' };
                }
                return { id_producto: item.id, cantidad_devuelta: quantity };
            });

            const returnCode = order.codigo_retorno || `DEV-${String(order.id_pedido).slice(-8)}`;
            const validUntil = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
            const { data: returnRow, error: returnError } = await database.from('devoluciones').insert({
                id_pedido: order.id_pedido,
                motivo: reason,
                metodo_reembolso: method,
                fecha_devolucion: new Date().toISOString(),
            }).select('id_devolucion').single();
            if (returnError) throw { status: 500, message: 'No se pudo crear la solicitud de devolución.' };

            const { error: detailError } = await database.from('detalle_devolucion').insert(
                requestedItems.map((item) => ({ ...item, id_devolucion: returnRow.id_devolucion })),
            );
            if (detailError) throw { status: 500, message: 'No se pudieron guardar los productos de la devolución.' };
            return { success: true, returnCode, validUntil };
        },
    };

    function mapOrder(order) {
        return {
            id: order.id_pedido,
            date: formatDate(order.fecha_compra),
            total: Number(order.total_pagado || 0),
            status: order.estado,
            paymentMethod: { type: 'Medio de pago original', last4: '' },
            items: (order.detalle_pedido || []).map((item) => ({
                id: item.id_producto,
                sku: item.productos?.sku || item.id_producto,
                name: item.productos?.nombre || 'Producto sin nombre',
                brand: item.productos?.marca || '',
                quantity: item.cantidad_comprada,
                unitPrice: Number(item.precio_unitario),
                imageUrl: item.productos?.imagen_url || '',
            })),
        };
    }
};

module.exports = { serviceFactory };