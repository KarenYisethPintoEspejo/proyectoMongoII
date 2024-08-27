const express = require('express');
const mongoose = require('mongoose');
const appLogin = express.Router();

const userSchema = new mongoose.Schema({
    username: String,
    id: Number 
});

const User = mongoose.model('User', userSchema, 'usuario');

appLogin.post('/login', async (req, res) => {
    const { username, password } = req.body;
    process.env.MONGO_USER = username;
    process.env.MONGO_PWD = password;
    const mongoUrl = `mongodb://${username}:${password}@${process.env.MONGO_CLUSTER}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

    try {
        await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        const user = await User.findOne({ username: username }).select('id username');

        if (user) {
            res.status(200).json({ 
                message: 'Login exitoso',
                userId: user.id 
            });
        } else {
            res.status(401).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(401).json({ message: 'Credenciales inválidas o error de conexión a la base de datos' });
    } finally {
        mongoose.disconnect();
    }
});

module.exports = appLogin;