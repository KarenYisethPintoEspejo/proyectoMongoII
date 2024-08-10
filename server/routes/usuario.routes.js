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

module.exports = appUsuario