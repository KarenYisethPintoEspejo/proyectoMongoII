const connect  = require('../helpers/db/connect')


module.exports = class usuario extends connect {
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
    
            // Insertar el nuevo usuario
            await this.collection.insertOne(usuarioSinContraseña);
    
            // Crear el usuario en la base de datos con el rol especificado
            await this.db.command({
                createUser: nombreUsuario,
                pwd: contraseña,
                roles: [{ role: usuarioData.rol, db: 'cineCampus' }]
            });
    
            // Si el rol es VIP, crear una tarjeta VIP
            if (usuarioData.rol === 'usuarioVIP') {
                const tarjetaCollection = this.db.collection('tarjeta');
    
                // Verificar que el usuario no tenga una tarjeta existente
                const tarjetaExistente = await tarjetaCollection.findOne({ id_usuario: usuarioData.id });
                if (tarjetaExistente) {
                    await this.conexion.close();
                    return { error: `El usuario con ID ${usuarioData.id} ya tiene una tarjeta VIP.` };
                }
    
                // Generar un número de tarjeta aleatorio
                const generarNumeroTarjeta = () => Math.floor(Math.random() * 1e16).toString().padStart(16, '0');
    
                let numeroTarjeta;
                let tarjetaExistenteConNumero;
    
                do {
                    numeroTarjeta = generarNumeroTarjeta();
                    tarjetaExistenteConNumero = await tarjetaCollection.findOne({ numero: numeroTarjeta });
                } while (tarjetaExistenteConNumero);
    
                // Crear la tarjeta VIP
                const nuevaTarjeta = {
                    id: usuarioData.id, // Usar el ID del usuario como ID de la tarjeta
                    numero: numeroTarjeta,
                    id_usuario: usuarioData.id,
                    estado: 'Activo',
                    '%descuento': 10 // Establecer un 10% de descuento
                };
    
                await tarjetaCollection.insertOne(nuevaTarjeta);
            }
    
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
    async obtenerDetallesUsuario(usuarioObj) {
        try {
            await this.conexion.connect();
            const { id } = usuarioObj;
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
        } finally {
            if (this.conexion) await this.conexion.close();
        }
    }
    


    /**
     * Actualiza el rol de un usuario en la base de datos.
     *
     * @param {string} id - El ID del usuario cuyo rol se desea actualizar.
     * @param {string} nuevoRol - El nuevo rol que se asignará al usuario.
     * @returns {Promise<Object>} Una promesa que se resuelve con un mensaje de éxito y el objeto del usuario actualizado,
     * o un objeto de error si no se encuentra el usuario o si ocurre un error durante la operación.
     *
     * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la actualización del usuario.
     */


    
    async actualizarRolUsuario(usuarioObj) {
        try {
            await this.conexion.connect();
            const { id, nuevoRol } = usuarioObj;
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
        } finally {
            if (this.conexion) await this.conexion.close();
        }
    }
    


    /**
     * Lista todos los usuarios en la base de datos, con la posibilidad de filtrar por rol.
     *
     * @param {string} [rol] - El rol por el cual filtrar los usuarios (opcional).
     * @returns {Promise<Object[]>} Una promesa que se resuelve con una lista de usuarios.
     *
     * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la consulta.
     */


    async listarUsuarios(rol) {
        try {
            await this.conexion.connect();

            const query = rol ? { rol } : {};
            const usuarios = await this.collection.find(query).toArray();

            await this.conexion.close();

            return usuarios;
        } catch (error) {
            if (this.conexion) await this.conexion.close();
            return { error: `Error al listar los usuarios: ${error.message}` };
        }
    }
}