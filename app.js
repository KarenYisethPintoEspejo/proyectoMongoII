const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const appPelicula = require('./server/routes/pelicula.routes');
const appBoleto = require('./server/routes/boleto.routes');
const appUsuario = require('./server/routes/usuario.routes');
const appAsiento = require('./server/routes/asiento.routes');
const appLogin = require('./server/routes/login.routes'); 

const config = {
    port: process.env.EXPRESS_PORT || 3000,
    host: process.env.EXPRESS_HOST || 'localhost',
    static: process.env.EXPRESS_STATIC || 'public'  
};

app.use(express.static(path.join(__dirname, config.static)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, config.static, 'index.html'));
});

app.get('/pelicula', (req, res) => {
    res.sendFile(path.join(__dirname, config.static, 'views', 'pelicula.html'));
});
app.use('/pelicula', appPelicula);

app.get('/boleto', (req, res) => {
    res.sendFile(path.join(__dirname, config.static, 'views', 'boleto.html'));
});
app.use('/boleto', appBoleto);

app.get('/usuario', (req, res) => {
    res.sendFile(path.join(__dirname, config.static, 'views', 'usuario.html'));
});
app.use('/usuario', appUsuario);

app.get('/asiento', (req, res) => {
    res.sendFile(path.join(__dirname, config.static, 'views', 'asiento.html'));
});
app.use('/asiento', appAsiento);

app.use('/', appLogin); 

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Error interno del servidor'
    });
});

app.listen(config.port, config.host, () => {
    console.log(`http://${config.host}:${config.port}`);
});