import { connect } from "../../helpers/db/connect.js";

export class pelicula extends connect {
    static instancePelicula;
    db;
    collection;

    constructor() {
        if (pelicula.instancePelicula) {
            return pelicula.instancePelicula;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('pelicula');
        pelicula.instancePelicula = this;
    }

    destructor() {
        pelicula.instancePelicula = undefined;
        connect.instanceConnect = undefined;
    }

    async getALLMovies() {
        await this.conexion.connect();
        const currentDate = new Date();

        const movies = await this.collection.aggregate([
            {
                $lookup: {
                    from: 'proyeccion',
                    localField: 'id',
                    foreignField: 'id_pelicula',
                    as: 'proyecciones',
                },
            },
            {
                $addFields: {
                    proyecciones: {
                        $filter: {
                            input: '$proyecciones',
                            as: 'proyeccion',
                            cond: { $gte: ['$$proyeccion.fecha', currentDate] },
                        },
                    },
                },
            },
            {
                $match: {
                    fecha_estreno: { $lte: currentDate },
                    fecha_retiro: { $gte: currentDate },
                },
            },
            {
                $project: {
                    _id: 0,
                    nombre: 1,
                    generos: 1,
                    duracion: 1,
                    fecha_estreno: 1,
                    fecha_retiro: 1,
                    fechas_proyecciones: '$proyecciones.fecha',
                    horas_proyecciones: '$proyecciones.hora',
                },
            },
        ]).toArray();

        await this.conexion.close();
        return movies;
    }
}
