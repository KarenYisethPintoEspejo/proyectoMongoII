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
    
}