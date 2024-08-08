const express = require('express');
// const pelicula = require('./server/modules/pelicula')
const app = express()
const appPelicula = require('./server/routes/pelicula.routes');
app.use(express.json())

const config={
    port:process.env.EXPRESS_PORT,
    host:process.env.EXPRESS_HOST,
    static:process.env.EXPRESS_STATIC
}

//PELICULA
app.get('/pelicula', async(req, res)=>{
    res.sendFile(`${config.static}/views/pelicula.html`, {root: __dirname})
})
app.use('/pelicula', appPelicula)

app.use((err, req, res, next) =>{
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Error interno del servidor'
    });
});



app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT},()=>{
    console.log(`http://${config.host}:${config.port}`)
})