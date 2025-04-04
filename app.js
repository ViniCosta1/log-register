const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORTA || 3000;

const routes = require('./routes/routes')
const loggingMiddleware = require('./middleware/save_logging');
const ipMiddleware = require('./middleware/get_ip_address');

app.use(express.json());
app.use(ipMiddleware);
app.use(loggingMiddleware);
app.use(routes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado a base de dados!');
        app.emit('ready');
    })
    .catch((err) => {
        console.log('Não foi possível se conectar a base de dados!');
        process.exit(1);
    });

app.on('ready', () => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
})