const express = require("express");
const boleto = require('../modules/boleto');
const appBoleto = express.Router();

appBoleto.post('/compraBoleto', async(req, res, next)=>{
    let obj = new boleto();
    try {
        const boletos = await obj.comprarBoleto(req.body)
        res.status(200).send(boletos)
    } catch (error) {
        next(error)
    } finally{
        obj.destructor()
    }
});

appBoleto.get("/disponibilidadAsientos/:id", async (req, res) => {
    let obj = new boleto();
    const id = req.params.id;
    const proyeccionObj = { id: parseInt(id, 10) };

    try {
        const disponibilidad = await obj.verificarDisponibilidadAsientos(proyeccionObj);

        if (disponibilidad.error) {
            res.status(404).send(disponibilidad); 
        } else {
            res.status(200).send(disponibilidad); 
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al verificar la disponibilidad de asientos' });
    } finally{
        obj.destructor()
    }
});


appBoleto.post('/reservaAsiento', async(req, res, next)=>{
    let obj = new boleto();
    try {
        const boletos = await obj.reservarAsiento(req.body);
        res.status(200).send(boletos)
    } catch (error) {
        next(error)
    } finally{
        obj.destructor()
    }
})

appBoleto.post("/cancelarReserva/:id", async (req, res) => {
    let obj = new boleto();
    const id = req.params.id;
    const boletoObj = { id: parseInt(id, 10) }; 

    try {
        const resultado = await obj.cancelarReserva(boletoObj);

        if (resultado.error) {
            res.status(404).send(resultado); 
        } else {
            res.status(200).send(resultado); 
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al cancelar la reserva del boleto' });
    } finally{
        obj.destructor()
    }
});

appBoleto.get('/boletos/:id_usuario', async (req, res) => {
    let obj = new boleto()
    try {
        const id_usuario = parseInt(req.params.id_usuario); 
        const boletos = await obj.obtenerBoletosConDetalles(id_usuario);
        
        res.json(boletos);
    } catch (error) {
        res.status(500).json({ error: `Error al obtener boletos: ${error.message}` });
    } finally {
        obj.destructor()
    }
});


module.exports = appBoleto