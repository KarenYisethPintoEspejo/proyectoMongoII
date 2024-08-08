const express = require('express');
const peliculas = require('./js/modules/pelicula')
const app = express()



// app.get("/peliculas", async(req, res)=>{
//     let obj= new pelicula();
//     res.status(200).send(await obj.getALLMovies());
// })


app.get("/pelicula/:id", async (req, res) => {
        let obj= new peliculas();
        const id = req.params.id;
        const peliculaObj = { id: parseInt(id, 1) }; // Asegúrate de convertir el ID a un entero si es necesario
        const pelicula = await obj.consultarPeliculas(peliculaObj);
        if (pelicula.error) {
            res.status(404).send(pelicula);
        } else {
            res.status(200).send(pelicula);
        }
});

app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT},()=>{
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`)
})