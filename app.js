const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const appPelicula = require('./server/routes/pelicula.routes');
const appBoleto = require('./server/routes/boleto.routes');
const appUsuario = require('./server/routes/usuario.routes');
const appAsiento = require('./server/routes/asiento.routes');

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

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Error interno del servidor'
    });
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    process.env.MONGO_USER = username;
    process.env.MONGO_PWD = password;
    const mongoUrl = `mongodb://${username}:${password}@${process.env.MONGO_CLUSTER}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

    try {

        await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.disconnect();

        res.status(200).json({ message: 'Login exitoso' });
    } catch (error) {
        res.status(401).json({ message: 'Credenciales inválidas o error de conexión a la base de datos' });
    }
});

app.listen(config.port, config.host, () => {
    console.log(`http://${config.host}:${config.port}`);
});