const express = require('express');
const router = express.Router();
const Pelicula = require('../modules/pelicula');

router.get('/listaPeliculas', async (req, res) => {
    const pelicula = new Pelicula();
    try {
        const movies = await pelicula.getALLMovies();
        res.status(200).send(movies);
    } catch (error) {
        console.error('Error al obtener las películas:', error);
        res.status(500).send({ error: 'Ocurrió un error al obtener las películas.' });
    } finally{
        pelicula.destructor()
    }
});

router.get('/buscarPeliculas', async (req, res) => {
    const query = req.query.q || '';
    const pelicula = new Pelicula();
    try {
        await pelicula.conexion.connect();
        const movies = await pelicula.collection.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { generos: { $regex: query, $options: 'i' } },
                { actores: { $regex: query, $options: 'i' } }
            ]
        }).toArray();
        res.json(movies);
    } catch (error) {
        console.error('Error al buscar películas:', error);
        res.status(500).send('Error al buscar películas');
    } finally{
        pelicula.destructor()
    }
});
router.get('/peliculaId/:id', async (req, res) => {
    const id = req.params.id;
    const pelicula = new Pelicula();
    try {
        const peliculaObj = { id: parseInt(id, 10) };
        const result = await pelicula.consultarPeliculas(peliculaObj);
        if (result.error) {
            res.status(404).send(result);
        } else {
            res.status(200).send(result);
        }
    } catch (error) {
        console.error('Error al consultar la película:', error);
        res.status(500).send({ error: 'Error al consultar la película' });
    } finally{
        pelicula.destructor()
    }
});

module.exports = router;
