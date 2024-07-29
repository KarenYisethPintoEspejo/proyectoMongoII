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
