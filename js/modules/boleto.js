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

            const boletoAsientoExistente = await this.collection.findOne({ id_proyeccion: ticketData.id_proyeccion, id_asiento: ticketData.id_asiento });
            if (boletoAsientoExistente) {
                throw new Error(`El asiento con ID ${ticketData.id_asiento} ya está ocupado para la proyección con ID ${ticketData.id_proyeccion}.`);
            }

            await this.collection.insertOne(ticketData);

            // Verificar si el usuario es VIP
            const tarjetaCollection = this.db.collection('tarjeta');
            const tarjetaUsuario = await tarjetaCollection.findOne({ id_usuario: ticketData.id_usuario, estado: 'Activo' });

            let montoFinal = ticketData.precio;
            if (tarjetaUsuario) {
                const descuento = tarjetaUsuario['%descuento'] || 0;
                montoFinal = ticketData.precio * (1 - descuento / 100);
            }

            // Verificar si ya se ha pagado por este boleto
            const pagoCollection = this.db.collection('pago');
            const pagoExistente = await pagoCollection.findOne({ boleto: ticketData.id });
            if (pagoExistente) {
                throw new Error(`El boleto con ID ${ticketData.id} ya ha sido pagado.`);
            }

            // Insertar el pago en la colección de pagos
            const nuevoPago = {
                id: await this.getNextId('pago'), // Método que genera el siguiente ID para la colección de pagos
                boleto: ticketData.id,
                monto: montoFinal,
                metodo_pago: 'Tarjeta de Crédito', // Puedes ajustar esto según tu lógica de negocio
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
}
