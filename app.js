const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors()); 

app.use(express.json());

const appPelicula = require('./server/routes/pelicula.routes');
const appBoleto = require('./server/routes/boleto.routes');
const appUsuario = require('./server/routes/usuario.routes');
const appAsiento = require('./server/routes/asiento.routes');

const config = {
    port: process.env.EXPRESS_PORT,
    host: process.env.EXPRESS_HOST,
    static: process.env.EXPRESS_STATIC
};


app.get('/pelicula', (req, res) => {
    res.sendFile(`${config.static}/views/pelicula.html`, { root: __dirname });
});
app.use('/pelicula', appPelicula);

app.get('/boleto', (req, res) => {
    res.sendFile(`${config.static}/views/boleto.html`, { root: __dirname });
});
app.use('/boleto', appBoleto);

app.get('/usuario', (req, res) => {
    res.sendFile(`${config.static}/views/usuario.html`, { root: __dirname });
});
app.use('/usuario', appUsuario);

app.get('/asiento', (req, res) => {
    res.sendFile(`${config.static}/views/asiento.html`, { root: __dirname });
});
app.use('/asiento', appAsiento);


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Error interno del servidor'
    });
});


app.listen({ host: config.host, port: config.port }, () => {
    console.log(`http://${config.host}:${config.port}`);
});
