import { connect } from "../../helpers/db/connect.js";

export class boleto extends connect {
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
            await this.conexion.close();

            return { mensaje: 'Boleto comprado exitosamente', boleto: ticketData, pago: nuevoPago };
        } catch (error) {
            await this.conexion.close();
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
     * Verifica la disponibilidad de un asiento para una proyección específica.
     *
     * @param {number} id_proyeccion - El ID de la proyección.
     * @param {number} id_asiento - El ID del asiento.
     * @returns {Promise<Object>} Una promesa que se resuelve con un objeto indicando si el asiento está disponible o no.
     *
     * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la ejecución de la operación de búsqueda.
     */


    async verificarDisponibilidadAsiento(id_proyeccion, id_asiento) {
        try {
            await this.conexion.connect();

            const proyeccionCollection = this.db.collection('proyeccion');
            const proyeccionExistente = await proyeccionCollection.findOne({ id: id_proyeccion });
            if (!proyeccionExistente) {
                throw new Error(`La proyección con ID ${id_proyeccion} no existe.`);
            }

            const asientoCollection = this.db.collection('asiento');
            const asientoExistente = await asientoCollection.findOne({ id: id_asiento });
            if (!asientoExistente) {
                throw new Error(`El asiento con ID ${id_asiento} no existe.`);
            }


            if (asientoExistente.id_sala !== proyeccionExistente.id_sala) {
                throw new Error(`El asiento con ID ${id_asiento} no pertenece a la sala de la proyección con ID ${id_proyeccion}.`);
            }

            const boletoAsientoExistente = await this.collection.findOne({ id_proyeccion, id_asiento });
            await this.conexion.close();

            if (boletoAsientoExistente) {
                return { disponible: false, mensaje: `El asiento con ID ${id_asiento} ya está ocupado para la proyección con ID ${id_proyeccion}.` };
            } else {
                return { disponible: true, mensaje: `El asiento con ID ${id_asiento} está disponible para la proyección con ID ${id_proyeccion}.` };
            }
        } catch (error) {
            await this.conexion.close();
            return { error: `Error al verificar la disponibilidad del asiento: ${error.message}` };
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
            await this.conexion.close();

 
            const plazoPago = new Date(fechaProyeccion);
            plazoPago.setDate(plazoPago.getDate() - 1); 

            return { 
                mensaje: `Asiento reservado exitosamente. Tienes hasta el ${plazoPago.toLocaleDateString()} para completar el pago, o la reserva se cancelará.`, 
                boleto: ticketData, 
                pago: nuevoPago 
            };
        } catch (error) {
            await this.conexion.close();
            return { error: `Error al reservar el boleto: ${error.message}` };
        }
    }



    
    /**
     * Cancela la reserva de un asiento específico, actualizando el estado del pago y eliminando el boleto de la colección.
     *
     * @param {number} id_boleto - El ID del boleto a cancelar.
     * @returns {Promise<Object>} Una promesa que se resuelve con un objeto indicando el resultado de la cancelación.
     *
     * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la ejecución de las operaciones de actualización/eliminación.
     */



    async cancelarReserva(id_boleto) {
        try {
            await this.conexion.connect();

            const boletoExistente = await this.collection.findOne({ id: id_boleto });
            if (!boletoExistente) {
                throw new Error(`El boleto con ID ${id_boleto} no existe.`);
            }

            const pagoCollection = this.db.collection('pago');
            const pagoExistente = await pagoCollection.findOne({ boleto: id_boleto, tipo_transaccion: 'Reserva' });
            if (!pagoExistente) {
                throw new Error(`No se encontró una reserva asociada al boleto con ID ${id_boleto}.`);
            }

            await pagoCollection.updateOne(
                { boleto: id_boleto, tipo_transaccion: 'Reserva' },
                { $set: { estado: 'Cancelado' } }
            );

            await this.collection.deleteOne({ id: id_boleto });
            await this.conexion.close();
            return { mensaje: `La reserva del asiento en el boleto con ID ${id_boleto} ha sido cancelada exitosamente.` };
        } catch (error) {
            await this.conexion.close();
            return { error: `Error al cancelar la reserva del boleto: ${error.message}` };
        }
    }

}

