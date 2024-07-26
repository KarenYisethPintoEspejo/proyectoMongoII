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
   - **API para Cancelar Reserva de Asientos:** Permitir la cancelación de una reserva de asiento ya realizada.

4. **Descuentos y Tarjetas VIP:**
   - **API para Aplicar Descuentos:** Permitir la aplicación de descuentos en la compra de boletos para usuarios con tarjeta VIP.
   - **API para Verificar Tarjeta VIP:** Permitir la verificación de la validez de una tarjeta VIP durante el proceso de compra.

5. - Roles Definidos:
     - **Administrador:** Tiene permisos completos para gestionar el sistema, incluyendo la venta de boletos en el lugar físico. Los administradores no están involucrados en las compras en línea realizadas por los usuarios.
     - **Usuario Estándar:** Puede comprar boletos en línea sin la intervención del administrador.
     - **Usuario VIP:** Puede comprar boletos en línea con descuentos aplicables para titulares de tarjetas VIP.
   - **API para Crear Usuario:** Permitir la creación de nuevos usuarios en el sistema, asignando roles y privilegios específicos (usuario estándar, usuario VIP o administrador).
   - **API para Obtener Detalles de Usuario:** Permitir la consulta de información detallada sobre un usuario, incluyendo su rol y estado de tarjeta VIP.
   - **API para Actualizar Rol de Usuario:** Permitir la actualización del rol de un usuario (por ejemplo, cambiar de usuario estándar a VIP, o viceversa).
   - **API para Listar Usuarios:** Permitir la consulta de todos los usuarios del sistema, con la posibilidad de filtrar por rol (VIP, estándar o administrador).

6. **Compras en Línea:**
   - **API para Procesar Pagos:** Permitir el procesamiento de pagos en línea para la compra de boletos.
   - **API para Confirmación de Compra:** Enviar confirmación de la compra y los detalles del boleto al usuario.

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