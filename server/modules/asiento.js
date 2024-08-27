const connect = require('../helpers/db/connect');

module.exports = class asiento extends connect {
    static instanceAsiento;
    db;
    collection;

    constructor() {
        if (asiento.instanceAsiento) {
            return asiento.instanceAsiento;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('asiento');
        asiento.instanceAsiento = this;
    }

    destructor() {
        asiento.instanceAsiento = undefined;
        connect.instanceConnect = undefined;
    }

    async listarAsientos({ id }) {
        await this.conexion.connect();
        try {
            const asientos = await this.collection.find({ id_sala: id }).toArray();
            return { mensaje: "Lista de asientos de la sala", data: asientos };
        } catch (error) {
            console.error("Error en listarAsientos:", error);
            return { error: "Error al listar los asientos", detalles: error.message };
        }
    }

    async verificarDisponibilidadProyeccion({ id }) {
        try {
            await this.conexion.connect();
            const proyeccionCollection = this.db.collection('proyeccion');
            const proyeccionExistente = await proyeccionCollection.findOne({ id });

            if (!proyeccionExistente) {
                throw new Error(`La proyección con ID ${id} no existe.`);
            }

            const fechaActual = new Date();
            if (new Date(proyeccionExistente.fecha) < fechaActual) {
                throw new Error(`La proyección con ID ${id} ya ha sucedido.`);
            }

            const id_sala = proyeccionExistente.id_sala;
            const asientosSala = await this.collection.find({ id_sala }).toArray();
            const boletoCollection = this.db.collection('boleto');
            const asientosOcupados = await boletoCollection.find({ id_proyeccion: id }).toArray();

            const asientosOcupadosIds = new Set(asientosOcupados.map(boleto => boleto.id_asiento));
            const asientosConEstado = asientosSala.map(asiento => ({
                ...asiento,
                ocupado: asientosOcupadosIds.has(asiento.id)
            }));

            return { disponible: asientosConEstado.length > 0, asientos: asientosConEstado };
        } catch (error) {
            console.error("Error en verificarDisponibilidadProyeccion:", error);
            return { error: `Error al verificar la disponibilidad: ${error.message}` };
        }
    }
};
