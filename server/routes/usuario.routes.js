const express = require('express');
const usuario = require('../modules/usuario');
const appUsuario = express.Router();

appUsuario.post('/crearUsuario', async(req, res, next)=>{
    try {
        let obj = new usuario();
        const usuarios = await obj.crearUsuario(req.body);
        res.status(200).send(usuarios)
    } catch (error) {
        next(error)
    }
})

appUsuario.get("/usuarioId/:id", async (req, res) => {
    let obj = new usuario();
    const id = req.params.id;  
    const usuarioObj = { id: parseInt(id, 10) };

    try {
        const usuarios = await obj.obtenerDetallesUsuario(usuarioObj);

        if (usuarios.error) {
            res.status(404).send(usuarios);
        } else {
            res.status(200).send(usuarios);
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al consultar el usuario' });
    }
});

appUsuario.post('/actualizarUsuario', async(req, res)=>{
    try {
        let obj = new usuario();
        const usuarios = await obj.actualizarRolUsuario(req.body);
        res.status(200).send(usuarios)
    } catch (error) {
        next (error)
    }
})

appUsuario.get('/usuarioPorRol/:rol', async (req, res) => {
    let obj = new usuario();
    const rol = req.params.rol; // Obtener el parámetro de consulta 'rol'

    try {
        const usuarios = await obj.listarUsuarios(rol);

        if (usuarios.error) {
            res.status(404).send(usuarios);
        } else {
            res.status(200).send(usuarios);
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al listar los usuarios' });
    }
});

appUsuario.get('/get-username', (req, res) => {
    const userName = process.env.MONGO_USER; // O cualquier variable de entorno que estés usando
    res.json({ userName });
});




module.exports = appUsuario