/**
 * Obtiene todas las películas con sus proyecciones y la información relacionada de la sala.
 *
 * @returns {Promise<Array>} Una promesa que se resuelve a un array de objetos de películas con sus proyecciones e información de la sala.
 *
 * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la ejecución de la operación de agregación.
 */    

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

    /**
     * Obtiene todas las películas con sus proyecciones y la información relacionada de la sala.
     * 
     * @returns {Promise<Array>} Una promesa que se resuelve a un array de objetos de películas con sus proyecciones e información de la sala.
     * 
     * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la ejecución de la operación de agregación.
     */

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


    async consultarPeliculas(id) {
        try {
            await this.conexion.connect();
            const consulta = { id: id };
            const pelicula = await this.collection.findOne(consulta);
            await this.conexion.close();
            if (!pelicula) {
                return { error: `No se encontró una pelicula con el ID ${id}` };
            }
            return pelicula;
        } catch (error) {
            await this.conexion.close();
            return { error: `Error al consultar la pelicula ${error.message}` };
        }
    }
}


