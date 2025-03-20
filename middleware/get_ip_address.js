const express = require('express');
const router = express.Router();

router.use(async (req, res, next) => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        req.ipAddress = data.ip;
        console.log('IP coletado com sucesso!');
    } catch (err) {
        console.log('Erro ao coletar IP!');
        console.log(err);
    }
    next();
})

module.exports = router;