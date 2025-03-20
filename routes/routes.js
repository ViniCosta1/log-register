const express = require('express');
const router = express.Router();
const Logging = require('../models/logging_schema');

router.get('/', (req, res) => {
    res.send('Salvando Logs!');
})

router.get('/logs', async (req, res) => {
    try {
        const logs = await Logging.find().lean();
        res.json(logs);
        console.log("Logs Listados com Sucesso!");
    } catch (err) {
        res.status(500).send('Erro ao listar logs!');
    }
})

router.get('/clear_logs', async (req, res) => {
    try {
        await Logging.deleteMany();
        res.send('Logs deletados com sucesso!');
        console.log("Logs Deletados com Sucesso!");
    } catch (err) {
        res.status(500).send('Erro ao deletar logs!');
    }
})

module.exports = router