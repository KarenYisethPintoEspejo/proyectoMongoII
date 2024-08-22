const express = require('express');
const asiento = require('../modules/asiento');
const appAsiento = express.Router();

appAsiento.get("/listarAsientos/:id", async (req, res) => {
    let obj = new asiento();
    const id = req.params.id;  
    const asientoObj = { id: parseInt(id, 10) };

    try {
        const asientos = await obj.listarAsientos(asientoObj);

        if (asientos.error) {
            res.status(404).send(asientos);
        } else {
            res.status(200).send(asientos);
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al consultar los asientos' });
    } finally{
        obj.destructor()
    }
});

appAsiento.get("/listarAsientosProyeccion/:id", async (req, res) => {
    let obj = new asiento();
    const id = req.params.id;  
    const asientoObj = { id: parseInt(id, 10) };

    try {
        const asientos = await obj.verificarDisponibilidadProyeccion(asientoObj);

        if (asientos.error) {
            res.status(404).send(asientos);
        } else {
            res.status(200).send(asientos);
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al consultar los asientos' });
    } finally{
        obj.destructor()
    }
});

module.exports = appAsiento