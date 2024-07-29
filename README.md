### Proyecto: CineCampus

#### Problematica

CineCampus es una empresa de entretenimiento que se especializa en ofrecer una experiencia de cine completa y personalizada. La empresa desea desarrollar una aplicación web que permita a los usuarios seleccionar películas, comprar boletos y asignar asientos de manera eficiente y cómoda. La aplicación también ofrecerá opciones de descuento para usuarios con tarjeta VIP y permitirá realizar compras en línea.

#### Objetivo

Desarrollar una serie de APIs para la aplicación web de CineCampus utilizando MongoDB como base de datos. Las APIs deberán gestionar la selección de películas, la compra de boletos, la asignación de asientos, y la implementación de descuentos para tarjetas VIP, con soporte para diferentes roles de usuario.

#### Requisitos Funcionales

1. **Selección de Películas:**

   

   - **API para Listar Películas:** Permitir la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección.

   **getALLMovies():** Consulta la información de todas las películas disponibles en nuestro catalogo.

   ***Parámetro:*** La información de las películas con sus proyecciones se muestra al poner esto en el main.js 

   ```javascript
   let objPelicula= new pelicula();
   
   console.log(await objPelicula.getALLMovies());
   
   objPelicula.destructor()
   ```

   Cuando se ejecuta eso en consola muestra toda la información de las películas disponibles.

   

   

   - **API para Obtener Detalles de Película:** Permitir la consulta de información detallada sobre una película específica, incluyendo sinopsis.

   **consultarPeliculas(id):** Consulta la información de una película en especifico.

   ***Parámetro:*** La información de consultar una pelicula en especifico con sus diferentes detalles se muestra al poner esto en el main.js 

   ```javascript
   let objPelicula= new pelicula();
   
   console.log(await objPelicula.consultarPeliculas(1));
   
   objPelicula.destructor()
   ```

   Cuando se ejecuta eso en consola muestra toda la información de una película en especifico.

   

2. **Compra de Boletos:**

   

   - **API para Comprar Boletos:** Permitir la compra de boletos para una película específica, incluyendo la selección de la fecha y la hora de la proyección.

   **comprarBoleto(ticketData)** Valida aspectos para la compra de un boleto

   ***Parámetro:*** Para poder hacer la compra de cierto boleto se pone el siguiente parámetro.

   ```javascript
   let objBoleto= new boleto();
   
   const ticketData = {
       id: 11,
       id_usuario: 1,
       id_asiento: 3,
       id_proyeccion: 4,
       precio: 12
   };
   
   console.log(await objBoleto.comprarBoleto(ticketData));
   
   objBoleto.destructor()
   ```

   Cuando se ejecuta eso en consola muestra la confirmación de la compra del boleto. 

   

   - **API para Verificar Disponibilidad de Asientos:** Permitir la consulta de la disponibilidad de asientos en una sala para una proyección específica.

   **verificarDisponibilidadAsiento(id_proyeccion, id_asiento)** Consulta la disponibilidad de un asiento para una proyeccion.

   ***Parámetro:*** Se ingresa el id_proyeccion y el id_asiento que queremos consultar de la siguiente forma:

   ```javascript
   let objBoleto= new boleto();
   
   console.log(await objBoleto.verificarDisponibilidadAsiento(1, 3));
   
   objBoleto.destructor()
   ```

   Cuando se ejecuta eso en consola muestra la disponibilidad de ese asiento.

   

3. **Asignación de Asientos:**

   

   - **API para Reservar Asientos:** Permitir la selección y reserva de asientos para una proyección específica.

   **reservarAsiento(ticketData)** Reserva el asiento para un proyección especifica dejando pendiente el pago.

   ***Parámetro:*** Se ingresa la información del boleto y asiento a reservar:

   ```javascript
   let objBoleto= new boleto();
   
   const ticketData = {
       "id": 11,
       "id_usuario": 2,
       "id_asiento": 7,
       "id_proyeccion": 4,
       "precio": 15
     }
   
   console.log(await objBoleto.reservarAsiento(ticketData));
   
   objBoleto.destructor()
   ```

   Cuando se ejecuta eso en consola muestra la confirmación de la reserva y el plazo del pago a realizar.

   

   - **API para Cancelar Reserva de Asientos:** Permitir la cancelación de una reserva de asiento ya realizada.

   **cancelarReserva(id_boleto)** Cancelación de la reserva de un asiento para una proyección en especifico y se cambia el pago a cancelado.

   ***Parámetro:*** Se ingresa el id del boleto a cancelar:

   ```javascript
   let objBoleto= new boleto();
   
   const idBoletoCancelar = 11;
   
   console.log(await objBoleto.cancelarReserva(idBoletoCancelar));
   
   objBoleto.destructor()
   ```

   Cuando se ejecuta eso en consola muestra la confirmación de la cancelación de la reserva de un asiento para una proyección en especifico.

   

4. **Descuentos y Tarjetas VIP:**

   ### Razón para No Implementarlo como una Función Aparte

   La funcionalidad de aplicar descuentos y verificar tarjetas VIP se implementa dentro del proceso de compra de boletos y reserva de asientos por las siguientes razones:

   **Coherencia en la Transacción:** Garantiza que todas las validaciones y modificaciones necesarias se realicen de manera secuencial y atomizada, manteniendo la coherencia y exactitud de la transacción.

   **Reducción de la Complejidad:** Incluir la lógica de descuentos y verificación de tarjetas VIP directamente en el flujo de compra/reserva simplifica el código y facilita el mantenimiento, evitando la gestión de múltiples puntos de integración.

   **Minimización de Errores:** Reduce el riesgo de errores de sincronización al realizar la verificación y aplicación de descuentos en el mismo flujo.

   **Mejora en la Experiencia del Usuario:** Proporciona una respuesta inmediata y coherente sobre la validez de la tarjeta VIP y el descuento aplicado, mejorando la experiencia del usuario.

   **Seguridad y Validación:** Permite realizar todas las verificaciones necesarias en un solo flujo, asegurando que solo se apliquen descuentos a usuarios elegibles con tarjetas VIP válidas.

   **Optimización del Rendimiento:** Reduce la cantidad de llamadas a la base de datos y optimiza el uso de recursos al mantener todas las operaciones en una única transacción.

   

   

   - **API para Aplicar Descuentos:** Permitir la aplicación de descuentos en la compra de boletos para usuarios con tarjeta VIP.

   ```javascript
   let montoFinal = ticketData.precio;
   if (tarjetaUsuario) {
       const descuento = tarjetaUsuario['%descuento'] || 0;
       montoFinal = ticketData.precio * (1 - descuento / 100);
   }
   
   ```

   Se realiza esta validación dentro de la función de comprar boletas o reservar asientos.

   

   

   - **API para Verificar Tarjeta VIP:** Permitir la verificación de la validez de una tarjeta VIP durante el proceso de compra.

   ```javascript
     const tarjetaCollection = this.db.collection('tarjeta');
               const tarjetaUsuario = await tarjetaCollection.findOne({ id_usuario: ticketData.id_usuario, estado: 'Activo' });
   
   ```

   Se realiza esta validación dentro de la función de comprar boletas o reservar asientos.

   

   

5. - Roles Definidos:
     
     
     
     - **Administrador:** Tiene permisos completos para gestionar el sistema, incluyendo la venta de boletos en el lugar físico. Los administradores no están involucrados en las compras en línea realizadas por los usuarios.
     
     ```javascript
     user: "Administrador",
     pwd: "admin123",
     roles: [
         { role: "dbOwner", db: "cineCampus" }
     ]
     // mongodb://Administrador:admin123@viaduct.proxy.rlwy.net:20744/
     ```
     
     Se creo el usuario de Administrador con rol de superAdmin, que tiene todos los permisos en todas las colecciones.
     
     
     
     - **Usuario Estándar:** Puede comprar boletos en línea sin la intervención del administrador.
     
     ```javascript
     user: "usuarioEstandar",
     pwd: "usarioEstandar123",
     roles: [
         { role: "usuarioEstandar", db: "cineCampus" }
     ]
     //mongodb://usuarioEstandar:usarioEstandar123@viaduct.proxy.rlwy.net:20744/
     ```
     
     Se creo el usuario de usuarioEstandar con rol de usuarioEstandar el cual tiene algunos permisos en las colecciones como buscar, insertar y borrar excepto en la colección de tarjeta.
     
     
     
     - **Usuario VIP:** Puede comprar boletos en línea con descuentos aplicables para titulares de tarjetas VIP.
     
     ```javascript
     user: "usuarioVIP",
     pwd: "usuarioVIP123",
     roles: [
         { role: "usuarioVIP", db: "cineCampus" }
     ]
     //mongodb://usuarioVIP:usuarioVIP123@viaduct.proxy.rlwy.net:20744/
     
     ```
     
     Se creo el usuario de usuarioVIP con rol de usuarioVIP el cual tiene algunos permisos en las colecciones como buscar, insertar y borrar.
     
     
     
   - **API para Crear Usuario:** Permitir la creación de nuevos usuarios en el sistema, asignando roles y privilegios específicos (usuario estándar, usuario VIP o administrador).

   

   **crearUsuario(usuarioData)** Creación del usuario en la colección y en la base de datos con su respectivo rol.

   ***Parámetro:*** Se ingresan los datos a insertar para crear el usuario.

   ```javascript
   let objUsuario = new usuario();
   
   const usuarioData = {
       id: 6,
       nombre: 'Karen Pinto',
       email: 'karen.pinto@example.com',
       rol: 'usuarioEstandar' 
   };
   
   console.log(await objUsuario.crearUsuario(usuarioData));
   
   objUsuario.destructor();
   ```

   Cuando se ejecuta eso , en consola se muestra la confirmación de la creación del usuario con su respectivo rol y permisos.

   

   - **API para Obtener Detalles de Usuario:** Permitir la consulta de información detallada sobre un usuario, incluyendo su rol y estado de tarjeta VIP.

   

   **cobtenerDetallesUsuario(id)** Consultar la informacion de un usuario e incluye si tiene tarjeta VIP y el estado de la misma.

   ***Parámetro:*** Se ingresa el id del usuario a consultar.

   ```javascript
   let objUsuario = new usuario();
   
   console.log(await objUsuario.obtenerDetallesUsuario(1));
   
   objUsuario.destructor();
   ```

   Cuando se ejecuta eso , en consola se muestra la información del usuario con id 1 junto su respectiva validación de tarjeta VIP.

   

   - **API para Actualizar Rol de Usuario:** Permitir la actualización del rol de un usuario (por ejemplo, cambiar de usuario estándar a VIP, o viceversa).

   

   **actualizarRolUsuario(id, nuevoRol)**  Actualizar el rol de un usuario en la coleccion y en la base de datos.

   ***Parámetro:*** Se ingresa el id del usuario y el nuevo rol a actualizar.

   ```javascript
   let objUsuario = new usuario();
   
   console.log(await objUsuario.actualizarRolUsuario(4, "usuarioEstandar"));
   
   objUsuario.destructor();
   
   ```

   Cuando se ejecuta eso , en consola se muestra la confirmación de la actualización del rol del usuario con id 4.

   

   - **API para Listar Usuarios:** Permitir la consulta de todos los usuarios del sistema, con la posibilidad de filtrar por rol (VIP, estándar o administrador).

   

   **alistarUsuarios(rol)**  Listar los usuarios por un rol en especifico.

   ***Parámetro:*** Se ingresa el rol a filtrar.

   ```javascript
   let objUsuario = new usuario();
   
   console.log(await objUsuario.listarUsuarios("usuarioVIP"));
   
   objUsuario.destructor();
   
   ```

   Cuando se ejecuta eso , en consola se muestra el listado de los usuarios que tienen como rol "usuarioVIP".

   

6. **Compras en Línea:**

   

   **Justificación de la No Implementación de APIs para Procesamiento de Pagos y Confirmación de Compra**

   

   - **API para Procesar Pagos:** Permitir el procesamiento de pagos en línea para la compra de boletos.

   **Justificación:** La implementación de esta API requiere la integración con servicios de pago especializados como Stripe o PayPal. Debido a la complejidad y a la necesidad de cumplir con normativas financieras y de seguridad, esta funcionalidad se maneja de manera distinta y no se incluye en el alcance de nuestro desarrollo actual.

   

   - **API para Confirmación de Compra:** Enviar confirmación de la compra y los detalles del boleto al usuario.

   **Justificación:** Esta API depende directamente del procesamiento de pagos, ya que es necesario validar y confirmar las transacciones antes de enviar cualquier detalle al usuario. Dado que el procesamiento de pagos no está incluido en nuestro enfoque actual, la implementación de esta API se considera fuera de contexto.

   

#### Requisitos Técnicos

- **Base de Datos:** Utilizar MongoDB para el almacenamiento de datos relacionados con películas, boletos, asientos, usuarios y roles.
- **Autenticación:** Implementar autenticación segura para el acceso a las APIs, utilizando roles de usuario para determinar los permisos y accesos (por ejemplo, usuarios VIP y usuarios estándar).
- **Autorización de Roles:** Asegurar que las APIs y las operaciones disponibles estén adecuadamente restringidas según el rol del usuario (por ejemplo, aplicar descuentos solo a usuarios VIP).
- **Escalabilidad:** Las APIs deben estar diseñadas para manejar un gran volumen de solicitudes concurrentes y escalar según sea necesario.
- **Documentación:** Proveer una documentación clara y completa para cada API, describiendo los endpoints, parámetros, y respuestas esperadas.

#### Entregables

1. **Código Fuente:** Repositorio en GitHub con el código de las APIs desarrolladas.
2. **Documentación de API:** Documento con la descripción detallada de cada API, incluyendo ejemplos de uso y formato de datos.
3. **Esquema de Base de Datos:** Diseño del esquema de MongoDB utilizado para almacenar la información.

#### Evaluación

- **Funcionalidad:** Cumplimiento de los requisitos funcionales establecidos.
- **Eficiencia:** Desempeño y tiempo de respuesta de las APIs.
- **Seguridad:** Implementación adecuada de medidas de seguridad, autenticación y autorización de roles.
- **Documentación:** Claridad y exhaustividad de la documentación proporcionada.