const connect  = require('../helpers/db/connect')



module.exports = class boleto extends connect {
    static instanceBoleto;
    db;
    collection;

    constructor() {
        if (boleto.instanceBoleto) {
            return boleto.instanceBoleto;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('boleto');
        boleto.instanceBoleto = this;
    }

    destructor() {
        boleto.instanceBoleto = undefined;
        connect.instanceConnect = undefined;
    }

    /**
     * Compra un boleto para una proyección específica validando todas las condiciones necesarias y realiza el pago.
     *
     * @param {Object} ticketData - Los datos del boleto a comprar.
     * @param {number} ticketData.id - El ID del boleto.
     * @param {number} ticketData.id_usuario - El ID del usuario.
     * @param {number} ticketData.id_asiento - El ID del asiento.
     * @param {number} ticketData.id_proyeccion - El ID de la proyección.
     * @param {number} ticketData.precio - El precio del boleto.
     * @returns {Promise<Object>} Una promesa que se resuelve con el objeto del boleto si la compra es exitosa, o un objeto de error si falla alguna validación.
     *
     * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la ejecución de la operación de inserción.
     */
    async comprarBoleto(ticketData) {
        try {
            await this.conexion.connect();

            const boletoExistente = await this.collection.findOne({ id: ticketData.id });
            if (boletoExistente) {
                throw new Error(`El boleto con ID ${ticketData.id} ya existe.`);
            }

            const usuarioCollection = this.db.collection('usuario');
            const usuarioExistente = await usuarioCollection.findOne({ id: ticketData.id_usuario });
            if (!usuarioExistente) {
                throw new Error(`El usuario con ID ${ticketData.id_usuario} no existe.`);
            }

            const proyeccionCollection = this.db.collection('proyeccion');
            const proyeccionExistente = await proyeccionCollection.findOne({ id: ticketData.id_proyeccion });
            if (!proyeccionExistente) {
                throw new Error(`La proyección con ID ${ticketData.id_proyeccion} no existe.`);
            }
            const fechaProyeccion = new Date(proyeccionExistente.fecha); 
            const fechaActual = new Date();
            if (fechaProyeccion < fechaActual) {
                throw new Error(`La proyección con ID ${ticketData.id_proyeccion} ya ha ocurrido.`);
            }

            const asientoCollection = this.db.collection('asiento');
            const asientoExistente = await asientoCollection.findOne({ id: ticketData.id_asiento });
            if (!asientoExistente) {
                throw new Error(`El asiento con ID ${ticketData.id_asiento} no existe.`);
            }

            // Verificar que el asiento pertenezca a la sala de la proyección
            if (asientoExistente.id_sala !== proyeccionExistente.id_sala) {
                throw new Error(`El asiento con ID ${ticketData.id_asiento} no pertenece a la sala de la proyección con ID ${ticketData.id_proyeccion}.`);
            }

            const boletoAsientoExistente = await this.collection.findOne({ id_proyeccion: ticketData.id_proyeccion, id_asiento: ticketData.id_asiento });
            if (boletoAsientoExistente) {
                throw new Error(`El asiento con ID ${ticketData.id_asiento} ya está ocupado para la proyección con ID ${ticketData.id_proyeccion}.`);
            }

            const tarjetaCollection = this.db.collection('tarjeta');
            const tarjetaUsuario = await tarjetaCollection.findOne({ id_usuario: ticketData.id_usuario, estado: 'Activo' });

            let montoFinal = ticketData.precio;
            if (tarjetaUsuario) {
                const descuento = tarjetaUsuario['%descuento'] || 0;
                montoFinal = ticketData.precio * (1 - descuento / 100);
            }

            await this.collection.insertOne(ticketData);

            const pagoCollection = this.db.collection('pago');
            const pagoExistente = await pagoCollection.findOne({ boleto: ticketData.id });
            if (pagoExistente) {
                throw new Error(`El boleto con ID ${ticketData.id} ya ha sido pagado.`);
            }

            const nuevoPago = {
                id: await this.getNextId('pago'),
                boleto: ticketData.id,
                monto: montoFinal,
                metodo_pago: 'Tarjeta de Crédito',
                fecha: new Date(),
                hora: new Date().toLocaleTimeString(),
                estado: 'Completado',
                tipo_transaccion: 'Compra'
            };

            await pagoCollection.insertOne(nuevoPago);


            return { mensaje: 'Boleto comprado exitosamente', boleto: ticketData, pago: nuevoPago };
        } catch (error) {

            return { error: `Error al comprar el boleto: ${error.message}` };
        }
    }

    /**
     * Obtiene el siguiente ID para una colección.
     *
     * @param {string} collectionName - El nombre de la colección.
     * @returns {Promise<number>} El siguiente ID.
     */
    async getNextId(collectionName) {
        const collection = this.db.collection(collectionName);
        const lastEntry = await collection.find().sort({ id: -1 }).limit(1).toArray();
        return lastEntry.length > 0 ? lastEntry[0].id + 1 : 1;
    }




    /**
     * Verifica la disponibilidad de asientos para una proyección específica.
     *
     * @param {Object} proyeccionObj - Un objeto que contiene el ID de la proyección.
     * @param {number} proyeccionObj.id - El ID de la proyección.
     * @returns {Promise<Object>} Una promesa que se resuelve con un objeto que indica si hay asientos disponibles o no.
     *                             Si hay asientos disponibles, devuelve un arreglo con los asientos disponibles.
     *                             Si no hay asientos disponibles, devuelve un mensaje indicando la falta de disponibilidad.
     *                             Si ocurre un error, devuelve un objeto con un mensaje de error.
     *
     * @throws {Error} Lanza un error si la proyección no existe, si la proyección ya ha sucedido,
     *                 o si hay algún problema durante la conexión a la base de datos o durante la ejecución de la operación de búsqueda.
     */
    async verificarDisponibilidadAsientos(proyeccionObj) {
        try {
            await this.conexion.connect();
            const proyeccionCollection = this.db.collection('proyeccion');
            const proyeccionExistente = await proyeccionCollection.findOne({ id: proyeccionObj.id });

            if (!proyeccionExistente) {
                throw new Error(`La proyección con ID ${proyeccionObj.id} no existe.`);
            }

            const fechaActual = new Date();
            if (new Date(proyeccionExistente.fecha) < fechaActual) {
                throw new Error(`La proyección con ID ${proyeccionObj.id} ya ha sucedido y no se puede realizar la consulta de asientos.`);
            }
            const id_sala = proyeccionExistente.id_sala;
            const asientoCollection = this.db.collection('asiento');
            const asientosSala = await asientoCollection.find({ id_sala }).toArray();

            const boletoCollection = this.collection;
            const asientosOcupados = await boletoCollection.find({ id_proyeccion: proyeccionObj.id }).toArray();

            const asientosDisponibles = asientosSala.filter(asiento => 
                !asientosOcupados.some(boleto => boleto.id_asiento === asiento.id)
            );

            if (asientosDisponibles.length > 0) {
                return { disponible: true, asientos: asientosDisponibles };
            } else {
                return { disponible: false, mensaje: `No hay asientos disponibles para la proyección con ID ${proyeccionObj.id}.` };
            }
        } catch (error) {
            return { error: `Error al verificar la disponibilidad de los asientos: ${error.message}` };
        }
    }

    
    




    /**
     * Reserva un boleto para una proyección específica validando todas las condiciones necesarias.
     *
     * @param {Object} ticketData - Los datos del boleto a reservar.
     * @param {number} ticketData.id - El ID del boleto.
     * @param {number} ticketData.id_usuario - El ID del usuario.
     * @param {number} ticketData.id_asiento - El ID del asiento.
     * @param {number} ticketData.id_proyeccion - El ID de la proyección.
     * @param {number} ticketData.precio - El precio del boleto.
     * @returns {Promise<Object>} Una promesa que se resuelve con el objeto del boleto si la reserva es exitosa, o un objeto de error si falla alguna validación.
     *
     * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la ejecución de la operación de inserción.
     */

    

    async reservarAsiento(ticketData) {
        try {
            await this.conexion.connect();

            const boletoExistente = await this.collection.findOne({ id: ticketData.id });
            if (boletoExistente) {
                throw new Error(`El boleto con ID ${ticketData.id} ya existe.`);
            }

            const usuarioCollection = this.db.collection('usuario');
            const usuarioExistente = await usuarioCollection.findOne({ id: ticketData.id_usuario });
            if (!usuarioExistente) {
                throw new Error(`El usuario con ID ${ticketData.id_usuario} no existe.`);
            }

            const proyeccionCollection = this.db.collection('proyeccion');
            const proyeccionExistente = await proyeccionCollection.findOne({ id: ticketData.id_proyeccion });
            if (!proyeccionExistente) {
                throw new Error(`La proyección con ID ${ticketData.id_proyeccion} no existe.`);
            }
            const fechaProyeccion = new Date(proyeccionExistente.fecha); 
            const fechaActual = new Date();
            if (fechaProyeccion < fechaActual) {
                throw new Error(`La proyección con ID ${ticketData.id_proyeccion} ya ha ocurrido.`);
            }

            const asientoCollection = this.db.collection('asiento');
            const asientoExistente = await asientoCollection.findOne({ id: ticketData.id_asiento });
            if (!asientoExistente) {
                throw new Error(`El asiento con ID ${ticketData.id_asiento} no existe.`);
            }

            if (asientoExistente.id_sala !== proyeccionExistente.id_sala) {
                throw new Error(`El asiento con ID ${ticketData.id_asiento} no pertenece a la sala de la proyección con ID ${ticketData.id_proyeccion}.`);
            }

            const boletoAsientoExistente = await this.collection.findOne({ id_proyeccion: ticketData.id_proyeccion, id_asiento: ticketData.id_asiento });
            if (boletoAsientoExistente) {
                throw new Error(`El asiento con ID ${ticketData.id_asiento} ya está ocupado para la proyección con ID ${ticketData.id_proyeccion}.`);
            }


            const tarjetaCollection = this.db.collection('tarjeta');
            const tarjetaUsuario = await tarjetaCollection.findOne({ id_usuario: ticketData.id_usuario, estado: 'Activo' });

            let montoFinal = ticketData.precio;
            if (tarjetaUsuario) {
                const descuento = tarjetaUsuario['%descuento'] || 0;
                montoFinal = ticketData.precio * (1 - descuento / 100);
            }

            await this.collection.insertOne({ ...ticketData, monto: montoFinal });

            const pagoCollection = this.db.collection('pago');
            const nuevoPago = {
                id: await this.getNextId('pago'),
                boleto: ticketData.id,
                monto: montoFinal,
                metodo_pago: 'Pendiente',
                fecha: new Date(),
                hora: new Date().toLocaleTimeString(),
                estado: 'Pendiente',
                tipo_transaccion: 'Reserva'
            };

            await pagoCollection.insertOne(nuevoPago);


 
            const plazoPago = new Date(fechaProyeccion);
            plazoPago.setDate(plazoPago.getDate() - 1); 

            return { 
                mensaje: `Asiento reservado exitosamente. Tienes hasta el ${plazoPago.toLocaleDateString()} para completar el pago, o la reserva se cancelará.`, 
                boleto: ticketData, 
                pago: nuevoPago 
            };
        } catch (error) {

            return { error: `Error al reservar el boleto: ${error.message}` };
        }
    }



    
    /**
     * Cancela la reserva de un boleto específico.
     *
     * @param {Object} boletoObj - Un objeto que contiene el ID del boleto.
     * @param {number} boletoObj.id - El ID del boleto.
     * @returns {Promise<Object>} Una promesa que se resuelve con un objeto que indica el éxito de la cancelación
     *                             o un mensaje de error si algo falla.
     *
     * @throws {Error} Lanza un error si el boleto no existe, si no hay una reserva asociada al boleto,
     *                 o si ocurre un problema durante la conexión a la base de datos o la ejecución de la operación.
     */
    async cancelarReserva(boletoObj) {
        try {
            await this.conexion.connect();

            const boletoExistente = await this.collection.findOne({ id: boletoObj.id });
            if (!boletoExistente) {
                throw new Error(`El boleto con ID ${boletoObj.id} no existe.`);
            }

            const pagoCollection = this.db.collection('pago');
            const pagoExistente = await pagoCollection.findOne({ boleto: boletoObj.id, tipo_transaccion: 'Reserva' });
            if (!pagoExistente) {
                throw new Error(`No se encontró una reserva asociada al boleto con ID ${boletoObj.id}.`);
            }

            await pagoCollection.updateOne(
                { boleto: boletoObj.id, tipo_transaccion: 'Reserva' },
                { $set: { estado: 'Cancelado' } }
            );

            await this.collection.deleteOne({ id: boletoObj.id });
            return { mensaje: `La reserva del asiento en el boleto con ID ${boletoObj.id} ha sido cancelada exitosamente.` };
        } catch (error) {

            return { error: `Error al cancelar la reserva del boleto: ${error.message}` };
        }
    }


}

