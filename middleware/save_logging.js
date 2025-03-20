const express = require('express');
const router = express.Router();
const Logging = require('../models/logging_schema');

router.use((req, res, next) => {
    Logging.create({
        method: req.method,
        user: req.ipAddress
    })
    .then(() => {
        console.log('Log salvo com sucesso!');
    })
    .catch((err) => {
        console.log('Erro ao salvar log!');
    });
    next();
})

module.exports = router
