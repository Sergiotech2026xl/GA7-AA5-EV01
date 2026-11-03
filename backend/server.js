const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const path = require('path');

// Carga la configuración privada desde la carpeta del servidor.
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const puerto = Number(process.env.PORT || 3000);
let cliente;
let usuarios;

// Acepta solicitudes JSON y limita su tamaño.
app.use(express.json({ limit: '10kb' }));
app.disable('x-powered-by');

// Publica únicamente la carpeta frontend; nunca el archivo .env.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Valida los datos también en el servidor, no solo en el formulario.
function validarDatos(req, res, next) {
    const { usuario, password } = req.body || {};

    if (typeof usuario !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            mensaje: 'Debes enviar usuario y contraseña como texto.'
        });
    }

    const nombre = usuario.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,30}$/.test(nombre)) {
        return res.status(400).json({
            mensaje: 'El usuario debe tener entre 3 y 30 letras, números o guiones bajos.'
        });
    }

    // bcrypt admite hasta 72 bytes; algunos caracteres ocupan más de uno.
    if (password.length === 0 || Buffer.byteLength(password, 'utf8') > 72) {
        return res.status(400).json({
            mensaje: 'La contraseña es obligatoria y no debe superar 72 bytes.'
        });
    }

    req.credenciales = { usuario: nombre, password };
    next();
}

// Registra al usuario y almacena un hash, nunca la contraseña original.
async function registrarUsuario(req, res, next) {
    try {
        const { usuario, password } = req.credenciales;

        if (password.length < 8) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 8 caracteres.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await usuarios.insertOne({
            usuario,
            passwordHash,
            fechaRegistro: new Date()
        });

        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente.'
        });
    } catch (error) {
        next(error);
    }
}

// Comprueba las credenciales y devuelve el resultado de autenticación.
async function iniciarSesion(req, res, next) {
    try {
        const { usuario, password } = req.credenciales;
        const registrado = await usuarios.findOne({ usuario });

        const esValida = registrado
            ? await bcrypt.compare(password, registrado.passwordHash)
            : false;

        // Usa el mismo mensaje para usuario inexistente o contraseña errónea.
        if (!esValida) {
            return res.status(401).json({
                mensaje: 'Error en la autenticación'
            });
        }

        return res.status(200).json({
            mensaje: 'Autenticación satisfactoria'
        });
    } catch (error) {
        next(error);
    }
}

// Rutas utilizadas por los dos formularios del frontend.
app.post('/api/usuarios/registro', validarDatos, registrarUsuario);
app.post('/api/usuarios/login', validarDatos, iniciarSesion);

// Devuelve JSON cuando se solicita una ruta que no existe.
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

// Centraliza los errores sin revelar credenciales ni detalles internos.
app.use((error, req, res, next) => {
    if (error.code === 11000) {
        return res.status(409).json({
            mensaje: 'El usuario ya está registrado.'
        });
    }

    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            mensaje: 'El contenido JSON no es válido.'
        });
    }

    if (error.type === 'entity.too.large') {
        return res.status(413).json({
            mensaje: 'La solicitud supera el tamaño permitido.'
        });
    }

    console.error('Error al procesar la solicitud:', error.name);

    return res.status(500).json({
        mensaje: 'Error interno del servidor. Intenta nuevamente.'
    });
});

// Conecta la base de datos antes de permitir solicitudes.
async function iniciarServidor() {
    if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
        throw new Error('CONFIGURACION_INCOMPLETA');
    }

    cliente = new MongoClient(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000
    });

    await cliente.connect();
    const baseDatos = cliente.db(process.env.DB_NAME);
    await baseDatos.command({ ping: 1 });

    usuarios = baseDatos.collection('usuarios');

    // Impide duplicados incluso si llegan dos registros simultáneos.
    await usuarios.createIndex({ usuario: 1 }, { unique: true });

    const servidor = app.listen(puerto, '127.0.0.1', () => {
        console.log('Conexión con MongoDB exitosa.');
        console.log(`Servidor disponible en http://localhost:${puerto}`);
    });

    servidor.on('error', manejarErrorInicio);
}

// Cierra la conexión si el servidor no puede iniciar.
async function manejarErrorInicio(error) {
    console.error('No se pudo iniciar el servidor.');
    console.error('Tipo de error:', error.code || error.name);
    console.error('Revisa .env, el acceso de red de Atlas y el puerto.');

    if (cliente) {
        await cliente.close();
    }

    process.exitCode = 1;
}

iniciarServidor().catch(manejarErrorInicio);