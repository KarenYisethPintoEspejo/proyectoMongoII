const express = require('express');
const router = express.Router();
const pelicula = require('../modules/pelicula');

router.get('/listaPeliculas', async (req, res) => {
    try {
        let obj = new pelicula();
        const movies = await obj.getALLMovies();
        res.status(200).send(movies);
    } catch (error) {
        console.error('Error al obtener las películas:', error);
        res.status(500).send({ error: 'Ocurrió un error al obtener las películas.' });
    }
});

router.get("/peliculaId/:id", async (req, res) => {
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

module.exports = router;