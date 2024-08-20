/**
 * Obtiene todas las películas con sus proyecciones y la información relacionada de la sala.
 *
 * @returns {Promise<Array>} Una promesa que se resuelve a un array de objetos de películas con sus proyecciones e información de la sala.
 *
 * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la ejecución de la operación de agregación.
 */    


const connect  = require('../helpers/db/connect')


module.exports = class pelicula extends connect {
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
                    $or: [
                        { fecha_estreno: { $lte: currentDate } }, 
                        { fecha_estreno: { $gt: currentDate } }   
                    ],
                    fecha_retiro: { $gte: currentDate } 
                },
            },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    nombre: 1,
                    generos: 1,
                    duracion: 1,
                    actores: 1,
                    fecha_estreno: 1,
                    fecha_retiro: 1,
                    fechas_proyecciones: '$proyecciones.fecha',
                    horas_proyecciones: '$proyecciones.hora',
                    precios_proyecciones: '$proyecciones.precio',
                    formatos_proyecciones: '$proyecciones.formato',
                    id_proyecciones: '$proyecciones.id',
                    id_proyecciones_sala: '$proyecciones.id_sala',
                    imagen: 1,
                    imagen2: 1,
                    trailer: 1
                },
            },
        ]).toArray();
    
        return movies;
    }
    
    


/**
 * Consulta una película por su ID en la base de datos.
 *
 * @param {string} id - El ID de la película que se desea consultar.
 * @returns {Promise<Object>} Una promesa que se resuelve con el objeto de la película si se encuentra,
 * o un objeto de error si no se encuentra o si ocurre un error durante la operación.
 *
 * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la ejecución
 * de la operación de consulta.
 */

    async consultarPeliculas(peliculaObj) {
        try {
            await this.conexion.connect();
            const consulta = { id: peliculaObj.id };
            const pelicula = await this.collection.findOne(consulta);

            if (!pelicula) {
                return { error: `No se encontró una película con el ID ${peliculaObj.id}` };
            }
            return pelicula;
        } catch (error) {

            throw new Error(`Error al consultar la película: ${error.message}`);
        }
    }
}


