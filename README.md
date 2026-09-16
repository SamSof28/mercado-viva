# MVP Mercado Viva - Sistema de Devoluciones Omnicanal

## Descripción del Proyecto
Mercado Viva es una cadena de supermercados que actualmente enfrenta graves cuellos de botella operativos y frustración en los clientes debido a la incapacidad de gestionar devoluciones de pedidos digitales en sus canales físicos. 

Este Producto Mínimo Viable (MVP) propone una solución de logística inversa. Conecta una interfaz para el cliente digital con una herramienta intuitiva en el Punto de Venta (POS) para el cajero. 

**Objetivo Principal:** Procesar devoluciones digitales de manera presencial, garantizando la consistencia de datos y el principio de "Dato Único" en el inventario.

## Estado actual

El proyecto está en etapa MVP/prototipo funcional. La interfaz, los contratos principales y las validaciones básicas están implementados, pero todavía hay funciones que deben endurecerse antes de un uso productivo:

- El pago real, Webpay, SAP y la emisión fiscal de una nota de crédito no están integrados. El backend devuelve un identificador de operación generado por la aplicación.
- La ruta de rechazo responde éxito, pero todavía no guarda el rechazo en una tabla de auditoría.
- El procesamiento de una devolución actualiza el pedido y el inventario mediante operaciones separadas; todavía no existe una transacción atómica.
- Existen datos de respaldo para desarrollo en algunas vistas. No deben interpretarse como datos reales.
- El portal cliente recibe `clientId` desde el frontend; debe sustituirse por el identificador derivado de una sesión autenticada antes de producción.

## Arquitectura

```text
frontend/                 React + TypeScript + Vite
		|
		| HTTP /api
		v
backend/src/              Express
		|
		v
Supabase PostgreSQL       pedidos, productos, devoluciones, inventario,
													cajeros y clientes
```

En Vercel, [`api/index.js`](api/index.js) expone el servidor Express como función serverless. [`vercel.json`](vercel.json) construye `frontend` y redirige `/api/*` hacia esa función.

## Estructura principal

```text
api/index.js                         Entrada serverless de Vercel
backend/src/index.js                 Configuración de Express
backend/src/routes/                  Rutas HTTP
backend/src/controllers/             Adaptadores HTTP y errores
backend/src/services/                Lógica de negocio y Supabase
backend/src/config/supabase.js       Cliente de Supabase
backend/test/                        Pruebas del servicio de devoluciones
frontend/src/App.tsx                 Rutas de React
frontend/src/pages/LoginPage.tsx     Login cliente/cajero
frontend/src/pages/ClientOrderPage.tsx Portal cliente
frontend/src/pages/ReturnsPage.tsx   POS de devoluciones
frontend/src/services/               Cliente API y adaptadores de datos
frontend/src/assets/                 Logo y placeholder locales
```

## Flujo de usuario

### Login

La pantalla `/` permite seleccionar Portal Cliente o Cajero/POS. Ambos envían:

```http
POST /api/session
Content-Type: application/json
```

```json
{
	"email": "usuario@mercadoviva.cl",
	"password": "********"
}
```

El backend busca primero un cajero activo en `cajeros`. Si no lo encuentra, intenta autenticar un cliente mediante Supabase Auth y consulta su perfil en `clientes`.

La respuesta contiene `role`, `user` y un token firmado con HMAC-SHA256. El frontend lo guarda en `localStorage` bajo `mercado-viva-token` y el cliente HTTP lo envía como:

```http
Authorization: Bearer <token>
```

El token dura ocho horas. `SESSION_SECRET` debe ser obligatorio y secreto en producción.

### Sesión POS

```http
GET /api/session
Authorization: Bearer <token-de-cajero>
```

Devuelve la tienda, caja, turno, versión y cajero autenticado. La ruta rechaza tokens de cliente.

### Portal cliente

Consulta el pedido más reciente:

```http
GET /api/get_request?clientId=<id_cliente>
```

El backend devuelve pedido, estado, total, método de pago e ítems. Los productos incluyen `imagen_url` desde la relación `productos`.

Crea una solicitud:

```http
POST /api/create_return
Content-Type: application/json
```

```json
{
	"orderId": "order-1",
	"items": [
		{ "id": "product-1", "quantity": 1 }
	],
	"reason": "Producto defectuoso",
	"method": "original_card"
}
```

La solicitud valida que los productos pertenezcan al pedido y guarda registros en `devoluciones` y `detalle_devolucion`. Devuelve un código de devolución y una fecha de vigencia.

### POS de devoluciones

Busca un pedido por código:

```http
GET /api/returns/:codigo_retorno
```

El backend valida que el código exista, que el pedido no esté devuelto y que no supere el plazo de 30 días. Devuelve los productos aptos para devolución, incluyendo `imagen_url`.

Calcula el reembolso:

```http
POST /api/returns/:codigo_retorno/calculate
```

```json
{
	"productos": [
		{
			"id_producto": "product-1",
			"cantidad_devuelta": 1
		}
	]
}
```

Procesa la devolución:

```http
POST /api/returns/:codigo_retorno/refund
```

El payload incluye tienda, método, motivo, notas, cantidades y estado físico. El servicio valida nuevamente los datos, actualiza el estado del pedido y repone inventario cuando el producto tiene estado `restock`.

Rechaza una solicitud:

```http
POST /api/returns/:codigo_retorno/reject
```

Actualmente esta ruta responde un mensaje de éxito, pero no persiste el rechazo.

## Imágenes de productos

Las imágenes de productos no se guardan dentro de PostgreSQL. Se almacenan en Supabase Storage y `productos.imagen_url` contiene la URL pública o accesible.

La consulta del backend incluye:

```sql
productos ( nombre, sku, es_devoluble, imagen_url )
```

El frontend transforma ese valor a `imageUrl`. La tabla POS usa [`product-placeholder.svg`](frontend/src/assets/product-placeholder.svg) cuando la URL está vacía o falla. El logo institucional se mantiene como asset local en [`frontend/src/assets/mercado-viva-logo.svg`](frontend/src/assets/mercado-viva-logo.svg).

Para completar el catálogo:

1. Crear un bucket de Storage, por ejemplo `product-images`.
2. Subir imágenes WebP optimizadas, idealmente de `512x512` y menos de `120 KB`.
3. Guardar la URL correspondiente en `productos.imagen_url`.
4. Comprobar que la URL pueda abrirse desde el navegador donde corre el POS.
5. Revisar productos pendientes:

```sql
select id_producto, sku, nombre
from public.productos
where imagen_url is null or trim(imagen_url) = '';
```

## Requisitos

- Node.js 18 o superior.
- npm.
- Proyecto Supabase con las tablas y relaciones usadas por los servicios.
- Acceso a Storage si se mostrarán imágenes desde Supabase.

## Instalación local

Desde la raíz:

```bash
npm install
npm install --prefix frontend
```

### Variables del backend

Copia `backend/.env.example` a `backend/.env`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-de-supabase
SESSION_SECRET=un-secreto-largo-y-aleatorio
PORT=3000
```

`SUPABASE_KEY` se usa desde el servidor y no debe exponerse en el frontend. No subas archivos `.env` al repositorio.

### Variables del frontend

Copia `frontend/.env.example` a `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_STORE_ID=tu-id-de-tienda
```

`VITE_STORE_ID` termina enviado al backend durante el procesamiento POS. Debe corresponder a la tienda de la sesión autenticada.

### Ejecutar en desarrollo

Terminal 1, backend:

```bash
npm run dev
```

Terminal 2, frontend:

```bash
npm run dev --prefix frontend
```

Aplicaciones locales:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Scripts

Desde la raíz:

```bash
npm run dev       # inicia Express
npm run build     # compila el frontend
npm test          # ejecuta las pruebas del backend
```

Desde `frontend`:

```bash
npm run dev       # inicia Vite
npm run build     # ejecuta tsc y vite build
npm run preview   # sirve el build generado
```

## Despliegue en Vercel

La configuración actual:

- Instalación: `npm install && npm install --prefix frontend`.
- Build: `npm run build --prefix frontend`.
- Salida: `frontend/dist`.
- `/api/*`: se redirige a `api/index.js`.
- El resto de rutas: se sirve desde `index.html`.

Configura en Vercel las variables del backend:

```text
SUPABASE_URL
SUPABASE_KEY
SESSION_SECRET
```

Para producción, `VITE_API_URL` puede quedar vacío si frontend y API se sirven desde el mismo dominio. Si se usa un backend separado, debe apuntar a su URL pública.

Antes de desplegar, verifica:

1. Que `frontend/src/assets/mercado-viva-logo.svg` esté incluido en Git.
2. Que las rutas respeten mayúsculas y minúsculas.
3. Que las imágenes de Supabase sean accesibles.
4. Que `npm run build` termine correctamente.
5. Que las variables estén configuradas en el entorno correcto de Vercel.

## Pruebas

Las pruebas actuales usan `serviceFactory` para probar la lógica de devoluciones sin conectarse a Supabase. Cubren:

- Cálculo de subtotal, IVA y total.
- Rechazo de cantidades superiores a la compra.
- Rechazo de pedidos con más de 30 días.
- Actualización de pedido y reposición de inventario.

Todavía faltan pruebas para autenticación, permisos por tienda, imágenes, solicitudes del portal cliente, rechazo persistido, fallos parciales de inventario y doble procesamiento.

## Mejoras prioritarias

1. Hacer obligatoria la autenticación en las rutas de cliente y devoluciones.
2. Derivar `clientId`, `id_tienda` y `id_cajero` del token, no del cliente.
3. Usar una transacción o función RPC de Supabase para pedido, devolución e inventario.
4. Persistir cada operación POS en `devoluciones` y `detalle_devolucion`.
5. Persistir y auditar los rechazos.
6. Eliminar fallbacks que simulan éxito cuando una API falla.
7. Unificar la regla de IVA entre frontend y backend.
8. Integrar el proveedor de pagos y la emisión fiscal antes de producción.
9. Añadir políticas RLS y revisar CORS para dominios permitidos.
10. Añadir pruebas de integración y una verificación de build en CI.

## Guía de Instalación y Uso para el Equipo

Para correr este proyecto en tu entorno local, asegúrate de tener instalado [Node.js](https://nodejs.org/) y Git.

### 1. Clonar el repositorio
```bash
git clone [https://github.com/SamSof28/mercado-viva.git](https://github.com/SamSof28/mercado-viva.git)
cd mercado-viva
```


### 2. Configurar el Backend (Node.js/Express)

Abre una terminal y navega a la carpeta del backend:

```bash
cd backend
npm install
```

Crea un archivo `.env` en la raíz de la carpeta `backend` y añade las credenciales de Supabase proporcionadas por el equipo:

```env
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_anon_key
SESSION_SECRET=un_secreto_largo_y_aleatorio
PORT=3000
```

El backend expone `POST /api/session` para cajeros y clientes, `GET /api/session`
para la sesión POS autenticada, `GET /api/get_request` para consultar un pedido y
`POST /api/create_return` para iniciar una devolución. Los cajeros deben tener su
contraseña almacenada como hash bcrypt en `CAJEROS.password_hash`; los clientes se
autentican mediante Supabase Auth y su perfil debe existir en `CLIENTES`.

Inicia el servidor de desarrollo:

```bash
npm run dev
```

*El backend estará corriendo en http://localhost:3000*

### 3. Configurar el Frontend (React/Vite)

Abre una **nueva** terminal (manteniendo el backend corriendo) y navega a la carpeta del frontend:

```bash
cd frontend
npm install
```

Crea un archivo `.env` en la raíz de la carpeta `frontend` para conectar con la API local:

```env
VITE_API_URL=http://localhost:3000
```

Inicia la aplicación de React:

```bash
npm run dev
```

*El frontend estará corriendo en http://localhost:5173*

