const crypto = require('crypto');

const TOKEN_TTL_SECONDS = 8 * 60 * 60;

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const decode = (value) => JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));

const getSecret = () => process.env.SESSION_SECRET || 'mercado-viva-development-secret';

const sign = (value) => crypto
    .createHmac('sha256', getSecret())
    .update(value)
    .digest('base64url');

const createToken = (user) => {
    const payload = encode({ ...user, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS });
    return `${payload}.${sign(payload)}`;
};

const readToken = (token) => {
    const [payload, signature] = String(token || '').split('.');
    const expectedSignature = payload ? sign(payload) : '';
    if (!payload || !signature || signature.length !== expectedSignature.length || !crypto.timingSafeEqual(
        Buffer.from(signature), Buffer.from(expectedSignature),
    )) {
        throw { status: 401, message: 'Sesión no válida o expirada.' };
    }

    const data = decode(payload);
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) {
        throw { status: 401, message: 'Sesión no válida o expirada.' };
    }
    return data;
};

const verifyPassword = async (password, passwordHash) => {
    if (!password || !passwordHash) return false;

    if (passwordHash.startsWith('$scrypt$')) {
        const [, , salt, expected] = passwordHash.split('$');
        if (!salt || !expected) return false;
        const actual = crypto.scryptSync(password, salt, 64).toString('hex');
        return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
    }

    if (passwordHash.startsWith('$2')) {
        try {
            const bcrypt = require('bcryptjs');
            return bcrypt.compare(password, passwordHash);
        } catch {
            throw { status: 500, message: 'El servidor no tiene habilitada la validación de contraseñas bcrypt.' };
        }
    }

    return false;
};

const serviceFactory = (database) => ({
    async iniciarSesion(email, password) {
        if (!email || !password) throw { status: 400, message: 'El correo y la contraseña son obligatorios.' };

        const { data: cashier, error } = await database
            .from('cajeros')
            .select('id_cajero, nombre_completo, correo_corporativo, password_hash, id_tienda')
            .eq('correo_corporativo', email.trim().toLowerCase())
            .eq('estado_activo', true)
            .single();

        if (cashier) {
            if (error || !(await verifyPassword(password, cashier.password_hash))) {
                throw { status: 401, message: 'Correo o contraseña incorrectos.' };
            }

            const user = {
                id: cashier.id_cajero,
                name: cashier.nombre_completo,
                email: cashier.correo_corporativo,
            };
            const posId = cashier.pos_id || 'CAJA-01';
            return {
                role: 'cajero',
                token: createToken({ id: user.id, role: 'cajero' }),
                user,
                storeSession: {
                    cashier: { ...user, role: 'Cajero Senior' },
                    posId,
                    storeId: cashier.id_tienda,
                    loginTime: new Date().toISOString(),
                    storeName: `Sucursal ${cashier.id_tienda}`,
                    register: posId,
                    shift: 'Turno actual',
                    posVersion: 'v1.0.0',
                },
            };
        }

        if (!database.auth?.signInWithPassword) throw { status: 401, message: 'Correo o contraseña incorrectos.' };
        const { data: authData, error: authError } = await database.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (authError || !authData?.user) throw { status: 401, message: 'Correo o contraseña incorrectos.' };
        const { data: client, error: clientError } = await database
            .from('clientes')
            .select('id_cliente, nombre_completo, email')
            .eq('email', email.trim().toLowerCase())
            .single();
        if (clientError || !client) throw { status: 401, message: 'El usuario cliente no está registrado.' };
        return {
            role: 'cliente',
            token: createToken({ id: client.id_cliente, role: 'cliente' }),
            user: { id: client.id_cliente, name: client.nombre_completo, email: client.email },
        };
    },
    obtenerSesion(token) {
        const session = readToken(token);
        if (session.role !== 'cajero') throw { status: 401, message: 'La sesión no corresponde a un cajero.' };
        return session;
    },
});

module.exports = { serviceFactory, createToken, readToken };