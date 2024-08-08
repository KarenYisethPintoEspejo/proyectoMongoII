const express = require('express');
const pelicula = require('../modules/pelicula')
const appPelicula = express()


appPelicula.get("/listaPeliculas", async(req, res)=>{
    let obj= new pelicula();
    res.status(200).send(await obj.getALLMovies());
})


appPelicula.get("/peliculaId/:id", async (req, res) => {
    let obj = new pelicula();
    const id = req.params.id;  
    const peliculaObj = { id: parseInt(id, 10) };

    try {
        const peliculas = await obj.consultarPeliculas(peliculaObj);

        if (peliculas.error) {
            res.status(404).send(peliculas);
        } else {
            res.status(200).send(peliculas);
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al consultar las películas' });
    }
});

module.exports= appPelicula