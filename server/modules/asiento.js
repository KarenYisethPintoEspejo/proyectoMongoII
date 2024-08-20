const connect  = require('../helpers/db/connect')



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

    async listarAsientos({id}) {
        await this.conexion.connect();
        try {
            const collection = this.db.collection('asiento');
            const res = await collection.find({ id_sala: id }).toArray(); // No desestructures el resultado
            return { mensaje: "Lista de asientos de la sala", data: res };
        } catch (error) {
            return { mensaje: "La sala no tiene asientos registrados", data: id };
        }
    }

    async verificarDisponibilidadProyeccion(proyeccionObj) {
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
    
            const boletoCollection = this.db.collection('boleto');
            const asientosOcupados = await boletoCollection.find({ id_proyeccion: proyeccionObj.id }).toArray();

            const asientosOcupadosIds = new Set(asientosOcupados.map(boleto => boleto.id_asiento));

            const asientosConEstado = asientosSala.map(asiento => ({
                ...asiento,
                ocupado: asientosOcupadosIds.has(asiento.id) 
            }));
    
            if (asientosConEstado.length > 0) {
                return { disponible: true, asientos: asientosConEstado };
            } else {
                return { disponible: false, mensaje: `No hay asientos disponibles para la proyección con ID ${proyeccionObj.id}.` };
            }
        } catch (error) {
            return { error: `Error al verificar la disponibilidad de los asientos: ${error.message}` };
        }
    }

}