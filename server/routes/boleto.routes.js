const express = require("express");
const boleto = require('../modules/boleto');
const appBoleto = express.Router();

appBoleto.post('/compraBoleto', async(req, res, next)=>{
    try {
        let obj = new boleto();
        const boletos = await obj.comprarBoleto(req.body)
        res.status(200).send(boletos)
    } catch (error) {
        next(error)
    }
});

appBoleto.get("/disponibilidadAsientos/:id", async (req, res) => {
    let obj = new boleto();
    const id = req.params.id;
    const proyeccionObj = { id: parseInt(id, 10) }; // Crear el objeto con el ID de la proyección

    try {
        const disponibilidad = await obj.verificarDisponibilidadAsientos(proyeccionObj);

        if (disponibilidad.error) {
            res.status(404).send(disponibilidad); // Error si la proyección no existe o ya sucedió
        } else {
            res.status(200).send(disponibilidad); // Enviar asientos disponibles
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al verificar la disponibilidad de asientos' });
    }
});


appBoleto.post('/reservaAsiento', async(req, res, next)=>{
    try {
        let obj = new boleto();
        const boletos = await obj.reservarAsiento(req.body);
        res.status(200).send(boletos)
    } catch (error) {
        next(error)
    }
})

appBoleto.post("/cancelarReserva/:id", async (req, res) => {
    let obj = new boleto();
    const id = req.params.id;
    const boletoObj = { id: parseInt(id, 10) }; // Crear el objeto con el ID del boleto

    try {
        const resultado = await obj.cancelarReserva(boletoObj);

        if (resultado.error) {
            res.status(404).send(resultado); // Error si el boleto no existe o no se encontró la reserva
        } else {
            res.status(200).send(resultado); // Mensaje de éxito de la cancelación
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al cancelar la reserva del boleto' });
    }
});


module.exports = appBoleto