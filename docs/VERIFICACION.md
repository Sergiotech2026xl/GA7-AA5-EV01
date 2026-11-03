# Informe de verificación — JXSTech EV03

Aprendiz: Sergio Murillo. Evidencia: GA7-220501096-AA5-EV03.

## Resultado

La versión final fue verificada el 3 de noviembre de 2026 mediante solicitudes HTTP reales y MongoDB Atlas real.

| Verificación | Resultado |
|---|---|
| Suite de integración | 38 casos aprobados; 0 fallidos |
| Colección de Postman ejecutada con Newman 6 | 36 solicitudes; 82 comprobaciones aprobadas; 0 fallos |
| Limpieza de bases de pruebas | Bases temporales eliminadas al terminar |
| Contratos de servicios | 24 operaciones documentadas en OpenAPI |

## Ejecución del aprendiz en Postman

El 3 de noviembre de 2026, el aprendiz ejecutó la colección completa en Postman contra su servidor local y MongoDB Atlas. El resumen mostrado en pantalla registró 82 comprobaciones aprobadas, 0 fallidas, 0 omitidas y 0 errores; duración: 13 segundos y 327 milisegundos.

La captura correspondiente está incluida en `Capturas/Resumen_pruebas_EV03.jpeg`. La documentación también se entrega en `docs/Documentacion_JXSTech_EV03.pdf`.

Los resultados de cada caso y sus fechas UTC están en `resultados-pruebas.json` y `resultados-postman.json`. Los informes no incluyen URI privadas, contraseñas reales ni tokens de sesión.

## Qué se comprobó

- Registro, usuario duplicado, contraseñas incorrectas, hash de contraseña y tokens guardados como hash.
- Protección de los módulos comerciales, sesión expirada y cierre de sesión.
- Registro, consulta, listado, actualización, baja lógica y reactivación de clientes y productos.
- Validaciones de correo, identificadores, precio, categoría, SKU, paginación y campos permitidos.
- Entradas y salidas de inventario, historial de movimientos y límites de existencias.
- Cálculo del total de venta en el servidor y conservación de precios históricos.
- Referencia única: un reintento no registra la misma venta ni descuenta dos veces.
- Reversión total cuando falla la segunda línea de una venta.
- Dos ventas simultáneas de la última unidad: una aceptada y otra rechazada, sin stock negativo.
- Dos solicitudes simultáneas con la misma referencia: una sola venta y un solo descuento.
- Anulaciones repetidas y simultáneas: restitución de existencias una sola vez.
- Anulación de una venta cuyo producto fue desactivado y posterior reactivación del producto.
- JSON inválido, tamaño máximo del cuerpo y rutas inexistentes.

## Cómo se realizaron las pruebas

La suite `backend/test/integracion.js` inició su propio servidor HTTP en un puerto libre. Para cada ejecución creó una base nueva cuyo nombre comenzó por `jxstech_ev03_test_`. La limpieza verificó el nombre exacto antes de eliminar únicamente esa base.

La colección incluida se ejecutó completa con Newman, el motor de línea de comandos para colecciones de Postman, contra otra base temporal independiente. El informe resume estados y comprobaciones; no conserva los cuerpos de solicitudes o respuestas que contienen tokens.

No se utilizaron simulaciones de la base de datos. La ejecución con Newman verifica la colección y sus scripts; no representa una grabación ni una revisión de la interfaz de escritorio de Postman.

La preparación del proyecto no incluye envío a Zajuna ni una grabación realizada por el aprendiz.
