const express = require('express');
const pelicula = require('./js/modules/pelicula')
const app = express()



app.get("/peliculas", async(req, res)=>{
    let obj= new pelicula();
    res.status(200).send(await obj.getALLMovies());
})


app.get("/pelicula/:id", async (req, res) => {
    let obj = new pelicula();
    const id = req.params.id;  
    const peliculaObj = { id: parseInt(id, 10) };

    try {
        const peliculas = await obj.consultarPeliculas(peliculaObj);

        if (peliculas.error) {
            res.status(404).send(peliculas);
        } else {
            res.status(200).send(pelicula);
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al consultar las películas' });
    }
});

app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT},()=>{
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`)
})