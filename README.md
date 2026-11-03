# Servicio web de registro e inicio de sesión

**Aprendiz:** Sergio Murillo  
**Evidencia:** GA7-220501096-AA5-EV01  
**Actividad:** Diseño y desarrollo de servicios web - caso.

## Objetivo

Diseñar y desarrollar un servicio web que permita registrar usuarios
y verificar sus credenciales durante el inicio de sesión.

Si las credenciales son correctas, responde:
"Autenticación satisfactoria".

Si son incorrectas, responde:
"Error en la autenticación".

## Tecnologías

- JavaScript y Node.js.
- Express para el servidor y las rutas HTTP.
- MongoDB para almacenar los usuarios.
- bcryptjs para generar y verificar hashes de contraseñas.
- dotenv para cargar la configuración.
- HTML y CSS para la interfaz.
- Git para el control de versiones.
- Postman para probar los servicios.

## Diseño de la solución

El navegador envía usuario y contraseña en formato JSON a la API.
Express valida los datos y consulta o guarda información en MongoDB.
La API devuelve un código HTTP y un mensaje JSON al cliente.

Flujo:

Navegador o Postman → API Express → MongoDB → Respuesta JSON

El proyecto verifica credenciales. No implementa sesiones persistentes,
tokens ni páginas privadas, porque no forman parte del caso solicitado.

## Estructura

- frontend/index.html: formularios, estilos y comunicación con la API.
- backend/server.js: conexión, validaciones, rutas y manejo de errores.
- backend/package.json: dependencias y comando de inicio.
- backend/package-lock.json: versiones de las dependencias.
- backend/.env.example: plantilla de configuración sin credenciales reales.
- .gitignore: exclusiones del control de versiones.
- README.md: documentación del proyecto.

El archivo backend/.env se crea localmente y no se entrega ni se publica.

## Requisitos

- Node.js 24 y npm.
- Una conexión propia a MongoDB local o MongoDB Atlas.
- Para Atlas: conexión a internet, usuario de base de datos y permiso
  de acceso para la IP del equipo que ejecutará el servidor.

El proyecto fue ejecutado con Node.js 24.21.0.

## Instalación y ejecución en Windows

1. Descomprimir el proyecto y abrir la carpeta principal en VS Code.
2. Abrir una terminal y entrar en backend:

```powershell
cd backend
```

3. Instalar las dependencias:

```powershell
npm.cmd ci
```

4. Si aún no existe .env, crear una copia de la plantilla:

```powershell
Copy-Item .env.example .env
```

5. Editar .env y completar una conexión propia:

```dotenv
PORT=3000
MONGODB_URI="mongodb+srv://USUARIO:CONTRASENA@TU_CLUSTER.mongodb.net/"
DB_NAME=sena_autenticacion
```

Los valores USUARIO, CONTRASENA y TU_CLUSTER deben reemplazarse.
Los caracteres especiales de las credenciales deben codificarse
para su uso en una URI.

Si se utiliza MongoDB local, la conexión puede ser:

```dotenv
MONGODB_URI="mongodb://127.0.0.1:27017"
```

6. Iniciar el servidor:

```powershell
npm.cmd start
```

7. Abrir http://localhost:3000 en el navegador.

Mantener la terminal abierta mientras se utiliza la aplicación.
Para detenerla, presionar Ctrl + C en la terminal.

No es necesario importar usuarios. El servidor prepara la colección
y el índice único; los registros se crean mediante la API.

## Almacenamiento

Base de datos: sena_autenticacion  
Colección: usuarios

Campos de cada documento:

- _id: identificador generado por MongoDB.
- usuario: nombre normalizado a minúsculas.
- passwordHash: hash de la contraseña.
- fechaRegistro: fecha de creación.

El índice único del campo usuario impide registros duplicados.
Las contraseñas originales no se almacenan ni se devuelven.

## Servicios

Las solicitudes utilizan el encabezado:

Content-Type: application/json

### Registro

POST http://localhost:3000/api/usuarios/registro

Ejemplo de cuerpo:

```json
{
    "usuario": "usuario_demo",
    "password": "PruebaSena2026"
}
```

Respuesta correcta: HTTP 201

```json
{
    "mensaje": "Usuario registrado correctamente."
}
```

Usuario repetido: HTTP 409

```json
{
    "mensaje": "El usuario ya está registrado."
}
```

### Inicio de sesión

POST http://localhost:3000/api/usuarios/login

Se envían los mismos campos: usuario y password.

Credenciales correctas: HTTP 200

```json
{
    "mensaje": "Autenticación satisfactoria"
}
```

Credenciales incorrectas: HTTP 401

```json
{
    "mensaje": "Error en la autenticación"
}
```

## Validaciones y errores

- Usuario: entre 3 y 30 letras sin tildes, números o guiones bajos.
- Los nombres de usuario se normalizan a minúsculas.
- Registro: contraseña de al menos 8 caracteres.
- Contraseña: máximo 72 bytes UTF-8, según el límite de bcrypt.
- Las validaciones se aplican también en el servidor.
- HTTP 400: datos inválidos o JSON mal formado.
- HTTP 404: ruta inexistente.
- HTTP 413: solicitud demasiado grande.
- HTTP 500: error interno, sin exponer detalles privados.

## Pruebas realizadas

Se verificaron en el navegador el registro, la autenticación correcta,
el rechazo de una contraseña incorrecta y el usuario duplicado.

En Postman se observaron:

| Caso | Estado | Resultado |
|---|---|---|
| Registro de usuario nuevo | 201 | Usuario registrado correctamente. |
| Inicio con credenciales correctas | 200 | Autenticación satisfactoria |
| Inicio con contraseña incorrecta | 401 | Error en la autenticación |
| Registro de usuario existente | 409 | El usuario ya está registrado. |

Las pruebas automáticas de estado y mensaje para los casos 201, 200
y 401 finalizaron con 2 de 2 comprobaciones aprobadas en cada caso.

Para repetir el registro exitoso se debe utilizar un nombre nuevo.
Repetir el mismo nombre debe devolver 409.

## Versionamiento y entrega

El proyecto utiliza Git. El enlace del repositorio se incluye en
ENLACE_REPOSITORIO.txt.

El ZIP debe incluir el código, los archivos de dependencias,
la plantilla .env.example, esta documentación y el enlace del repositorio.

No incluir node_modules ni el archivo .env con credenciales reales.

## Referencia formativa

SENA. Construcción API. Junio de 2024.
Documento del componente formativo: 228118_CF21_DU.pdf.