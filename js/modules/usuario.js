import { connect } from "../../helpers/db/connect.js";

export class usuario extends connect {
    static instanceUsuario;
    db;
    collection;

    constructor() {
        if (usuario.instanceUsuario) {
            return usuario.instanceUsuario;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('usuario');
        usuario.instanceUsuario = this;
    }

    destructor() {
        usuario.instanceUsuario = undefined;
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

    /**
     * Obtiene los detalles de un usuario, incluyendo su rol y estado de tarjeta VIP.
     *
     * @param {string} id - El ID del usuario que se desea consultar.
     * @returns {Promise<Object>} Una promesa que se resuelve con el objeto del usuario, incluyendo los detalles de su tarjeta VIP,
     * o un objeto de error si no se encuentra el usuario o si ocurre un error durante la operación.
     *
     * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la consulta.
     */
    async obtenerDetallesUsuario(id) {
        try {
            await this.conexion.connect();

            const usuario = await this.collection.findOne({ id });
            if (!usuario) {
                return { error: `No se encontró un usuario con el ID ${id}.` };
            }

            const tarjetaCollection = this.db.collection('tarjeta');
            const tarjeta = await tarjetaCollection.findOne({ id_usuario: id });

            const detallesUsuario = {
                ...usuario,
                tarjetaVIP: tarjeta ? tarjeta.estado : 'No tiene tarjeta VIP'
            };

            return detallesUsuario;
        } catch (error) {
            if (this.conexion) await this.conexion.close();
            return { error: `Error al obtener los detalles del usuario: ${error.message}` };
        }
    }

    async actualizarRolUsuario(id, nuevoRol) {
        try {
            await this.conexion.connect();

            const usuario = await this.collection.findOne({ id });
            if (!usuario) {

                return { error: `No se encontró un usuario con el ID ${id}.` };
            }

            const nombreUsuario = usuario.nombre.replace(/\s+/g, '');

            const db = this.conexion.db('cineCampus');

            await db.command({
                dropUser: nombreUsuario
            });

            await this.collection.updateOne({ id }, { $set: { rol: nuevoRol } });

            const contraseña = `${nombreUsuario}${123}`;
            await db.command({
                createUser: nombreUsuario,
                pwd: contraseña,
                roles: [{ role: nuevoRol, db: 'cineCampus' }]
            });

            const usuarioActualizado = await this.collection.findOne({ id });
            return { mensaje: 'Rol de usuario actualizado exitosamente', usuario: usuarioActualizado };
        } catch (error) {
            if (this.conexion) await this.conexion.close();
            return { error: `Error al actualizar el rol del usuario: ${error.message}` };
        }
    }
}