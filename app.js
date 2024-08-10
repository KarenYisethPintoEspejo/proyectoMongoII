const express = require('express');
// const pelicula = require('./server/modules/pelicula')
const app = express()
app.use(express.json())
const appPelicula = require('./server/routes/pelicula.routes');
const appBoleto = require('./server/routes/boleto.routes');
const appUsuario = require('./server/routes/usuario.routes')



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


//BOLETO
app.get('/boleto', async(req, res)=>{
    res.sendFile(`${config.static}/views/boleto.html`, {root: __dirname})
});
app.use('/boleto', appBoleto)


//USUARIO
app.get('/usuario', async(req, res)=>{
    res.sendFile(`${config.static}/views/usuario.html`, {root: __dirname})
});
app.use('/usuario', appUsuario)






app.use((err, req, res, next) =>{
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Error interno del servidor'
    });
});



app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT},()=>{
    console.log(`http://${config.host}:${config.port}`)
})