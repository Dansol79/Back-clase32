const { Router } = require('express');
const router = new Router();
const fork = require('child_process')
const { yargObj } = require('../../utils/yargs');
const numerosRandom = require('../../utils/numerosRamdom');
// const PORT = process.argv[2] || yargObj.port;
const logger = require('../../utils/winston');

module.exports = (app) => {
    app.use('/api/random', router);

    router.get('/', (req, res) => {
        logger.log('info', `ruta /api/randoms, metodo get`);
        let cant = req.query.cant || 100000000;
        let numeros = numerosRandom(cant);

        res.send(numeros);
    });
}