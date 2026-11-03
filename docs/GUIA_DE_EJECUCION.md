# Guía de ejecución y revisión — JXSTech EV03

Aprendiz: Sergio Murillo. Evidencia: GA7-220501096-AA5-EV03.

## 1. Preparar la carpeta

Extrae el ZIP y abre la carpeta del proyecto con Visual Studio Code. El proyecto de EV01 permanece disponible por separado. Esta versión corresponde a una tienda de relojes y audífonos inteligentes.

Se necesita Node.js 20.19 o posterior, npm, MongoDB Atlas y una conexión autorizada al clúster. El equipo donde se desarrolló utilizó Node.js 24.21.0.

## 2. Configurar MongoDB

En la carpeta `backend`, copia `.env.example` y renombra la copia como `.env`.

Completa `MONGODB_URI` con tu conexión de Atlas. Puedes usar el mismo clúster de EV01, pero utiliza **DB_NAME=jxstech_ev03** para mantener separados los datos de este proyecto. Mantén **PORT=3001** para evitar interferir con EV01 en el puerto 3000.

El usuario de Atlas debe tener permiso de lectura y escritura sobre esa base. Para las pruebas automáticas también necesita poder crear y eliminar bases temporales cuyo nombre comienza por `jxstech_ev03_test_`. Configura el acceso de red de Atlas para la IP del equipo. No compartas el contenido de `.env` ni lo subas a GitHub.

Las ventas utilizan transacciones de varias colecciones: se necesita Atlas o un replica set. Un servidor MongoDB standalone no sirve para este diseño.

## 3. Instalar e iniciar

Abre una terminal en `backend` y ejecuta:

```powershell
npm.cmd ci
npm.cmd start
```

Deja abierta la terminal. El mensaje esperado es:

```text
JXSTech EV03 disponible en http://localhost:3001
```

Abre `http://localhost:3001/api/salud`. Debe mostrar `estado: disponible`.

La dirección `http://localhost:3001` conserva una página sencilla de registro e inicio de sesión. Para trabajar con los demás módulos, utiliza Postman. El frontend React anterior no está conectado en esta entrega.

## 4. Leer la documentación

Abre `docs/SERVICIOS.html` en el navegador para leer el manual completo. `SERVICIOS.md` contiene la misma documentación en texto. `openapi.json` describe formalmente las 24 operaciones y sus modelos de datos.

## 5. Ejecutar la demostración en Postman

1. Abre **Import** (Importar) y selecciona `postman/JXSTech_EV03.postman_collection.json`.
2. Selecciona la colección **JXSTech — GA7-AA5-EV03**.
3. Abre **Variables** y comprueba que `baseUrl` sea `http://localhost:3001`. Las demás variables se completan automáticamente.
4. Pulsa **Run collection** (Ejecutar colección), selecciona las 36 solicitudes en su orden y ejecuta una sola iteración.
5. Revisa los códigos HTTP y las comprobaciones. Los casos 401 y 409 indicados en los nombres son pruebas negativas esperadas.

El registro de prueba genera un usuario, documento, correo, SKU y referencia nuevos. El login guarda el token en una variable de colección y las solicitudes comerciales lo envían como Bearer automáticamente. La colección no incluye tus credenciales reales de MongoDB.

La secuencia demuestra registro, sesión, clientes, productos, entradas y salidas de inventario, venta, rechazo por stock insuficiente, anulación, bajas lógicas, reactivación y cierre de sesión. Los datos ficticios de la colección permanecen en `jxstech_ev03`; no se ejecuta contra datos comerciales reales.

Si repites varias veces la demostración, puedes alcanzar el límite de 30 solicitudes combinadas de registro/login por IP en 15 minutos. Espera el tiempo indicado por la respuesta 429.

## 6. Ejecutar las pruebas automáticas

Detener el servidor de demostración no es necesario: las pruebas levantan su propio servidor en un puerto libre. Desde `backend` ejecuta:

```powershell
npm.cmd test
```

Las pruebas usan la URI de `.env`, crean su propia base temporal y la eliminan al finalizar. No utilizan `DB_NAME` como destino de pruebas y no borran las bases de EV01 o EV03. Si la ejecución se interrumpe abruptamente, una base temporal puede permanecer en Atlas; identifica su nombre antes de eliminarla manualmente.

El resultado registrado durante la preparación se encuentra en `docs/resultados-pruebas.json`. Ese informe describe pruebas HTTP automatizadas reales; no representa una grabación ni una ejecución de la interfaz de Postman.

También se ejecutó la colección completa con Newman: 36 solicitudes y 82 comprobaciones aprobadas, sin fallos. Su informe está en `docs/resultados-postman.json`. El resumen de ambas verificaciones se encuentra en `docs/VERIFICACION.md`.

## 7. Revisar el repositorio

El archivo `ENLACE_REPOSITORIO.txt` enlaza la rama **aa5-ev03-jxstech**, que conserva el historial de EV01. El código de EV03 está en esa rama. La rama principal de EV01 conserva su versión anterior.

Para descargar la versión con su historial desde GitHub:

```powershell
git clone --branch aa5-ev03-jxstech https://github.com/Sergiotech2026xl/GA7-AA5-EV01.git JXSTech-EV03
```

## 8. Entregar

Revisa que el ZIP incluya `backend`, `frontend`, `docs`, `postman`, `README.md`, `.gitignore` y `ENLACE_REPOSITORIO.txt`. Las dependencias se recuperan con `npm.cmd ci`; `.env` y `node_modules` quedan excluidos.

El nombre preparado es **SERGIO_MURILLO_AA5_EV03.zip**. La actividad corresponde a EV03, aunque el ejemplo de nombre del enunciado compartido menciona EV01. Si el instructor confirma que se debe conservar literalmente ese ejemplo, cambia solamente el nombre del comprimido.

Sube el archivo al espacio **Diseño y desarrollo de servicios web – proyecto. GA7-220501096-AA5-EV03**. El desarrollo local, el repositorio y el ZIP no equivalen a una entrega confirmada en Zajuna.
