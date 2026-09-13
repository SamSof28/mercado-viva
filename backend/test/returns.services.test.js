const test = require('node:test');
const assert = require('node:assert/strict');
const { serviceFactory } = require('../src/services/returns.services');

const order = {
    id_pedido: 'order-1',
    codigo_retorno: 'DEV-8492',
    estado: 'entregado',
    fecha_compra: '2026-09-01T00:00:00.000Z',
    total_pagado: 1190,
    detalle_pedido: [
        { id_producto: 'product-1', cantidad_comprada: 2, precio_unitario: 1000, productos: { nombre: 'Producto', sku: 'SKU-1' } },
        { id_producto: 'product-2', cantidad_comprada: 1, precio_unitario: 500, productos: { nombre: 'Otro', sku: 'SKU-2' } },
    ],
};

function createDatabase() {
    const updates = [];
    const database = {
        updates,
        from(table) {
            const query = {
                select() { return query; },
                update(values) { query.updateValues = values; return query; },
                eq(column, value) {
                    query.filters ??= {};
                    query.filters[column] = value;
                    return query;
                },
                single() {
                    if (table === 'pedidos_web') return Promise.resolve({ data: order, error: null });
                    return Promise.resolve({ data: { stock_disponible: 3 }, error: null });
                },
                then(resolve, reject) {
                    if (query.updateValues) {
                        updates.push({ table, values: query.updateValues, filters: query.filters });
                    }
                    return Promise.resolve({ data: null, error: null }).then(resolve, reject);
                },
            };
            return query;
        },
    };
    return database;
}

test('calcula subtotal, IVA y total para productos seleccionados', async () => {
    const service = serviceFactory(createDatabase());
    const result = await service.calcularMontos('DEV-8492', {
        productos: [{ id_producto: 'product-1', cantidad_devuelta: 2 }],
    });

    assert.deepEqual(result, {
        selectedCount: 2,
        subtotal: 2000,
        ivaAmount: 380,
        totalRefund: 2380,
        shippingCost: 0,
        isShippingRefundable: false,
        currency: 'CLP',
    });
});

test('rechaza cantidades superiores a la compra original', async () => {
    const service = serviceFactory(createDatabase());

    await assert.rejects(
        service.calcularMontos('DEV-8492', {
            productos: [{ id_producto: 'product-2', cantidad_devuelta: 2 }],
        }),
        (error) => error.status === 400 && error.message.includes('cantidad')
    );
});

test('actualiza pedido y repone inventario cuando el producto es apto', async () => {
    const database = createDatabase();
    const service = serviceFactory(database);
    const result = await service.ejecutarReembolso('DEV-8492', {
        id_tienda: 'store-1',
        refundMethod: 'original_card',
        globalReason: 'Producto defectuoso',
        productos: [{ id_producto: 'product-1', cantidad_devuelta: 1, physicalStatus: 'restock' }],
    });

    assert.equal(result.success, true);
    assert.equal(database.updates.length, 2);
    assert.equal(database.updates[0].table, 'pedidos_web');
    assert.equal(database.updates[1].table, 'inventario_tienda');
});
