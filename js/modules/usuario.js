import { connect } from "../../helpers/db/connect.js";

export class Usuario extends connect {
    static instanceUsuario;
    db;
    collection;

    constructor() {
        if (Usuario.instanceUsuario) {
            return Usuario.instanceUsuario;
        }
        super();
        this.db = this.conexion.db(this.getDbName());
        this.collection = this.db.collection('usuario');
        Usuario.instanceUsuario = this;
    }

    destructor() {
        Usuario.instanceUsuario = undefined;
        connect.instanceConnect = undefined;
    }

    /**
     * Crea un nuevo usuario en la base de datos.
     *
     * @param {Object} usuarioData - Los datos del usuario a crear.
     * @param {string} usuarioData.id - El ID del usuario.
     * @param {string} usuarioData.nombre - El nombre del usuario.
     * @param {string} usuarioData.rol - El rol del usuario.
     * 
     * @returns {Promise<Object>} Una promesa que se resuelve con un mensaje de éxito y el objeto del usuario creado sin la contraseña,
     * o un objeto de error si ya existe un usuario con el mismo ID o si ocurre un error durante la operación.
     *
     * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la creación del usuario.
     */
    async crearUsuario(usuarioData) {
        try {
            await this.conexion.connect();

            const usuarioExistente = await this.collection.findOne({ id: usuarioData.id });
            if (usuarioExistente) {
                await this.conexion.close();
                return { error: `Ya existe un usuario con el ID ${usuarioData.id}.` };
            }

            const nombreUsuario = usuarioData.nombre.replace(/\s+/g, '');
            const contraseña = `${nombreUsuario}${123}`;

            const usuarioSinContraseña = { ...usuarioData };

            await this.collection.insertOne(usuarioSinContraseña);

            await this.db.command({
                createUser: nombreUsuario,
                pwd: contraseña,
                roles: [{ role: usuarioData.rol, db: 'cineCampus' }]
            });

            await this.conexion.close();

            return { mensaje: 'Usuario creado exitosamente', usuario: usuarioSinContraseña };
        } catch (error) {
            if (this.conexion) await this.conexion.close();
            return { error: `Error al crear el usuario: ${error.message}` };
        }
    }
}
