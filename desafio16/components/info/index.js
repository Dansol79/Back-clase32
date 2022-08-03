const { Router } = require('express');
const router = new Router();
const yarg  = require('yargs');
const numCPUs = require('os').cpus().length;
const getArguments = require('../../utils/getTerminalArguments')
const logger = require('../../utils/winston/index');

const data = yarg(process.argv.slice(2)).argv;

const info = {
    argumentosDeEntrada: getArguments(data),
    nombreDeLaPlataforma: process.platform,
    versionNode: process.version,
    rss: process.memoryUsage().rss,
    pathDeEjecucion: process.title,
    processId: process.pid,
    carpetaDelProyecto: process.cwd(),
    cantidadDeProcesadores: numCPUs
};

module.exports = (app) => {
    app.use('/info', router);

    router.get('/', (req, res) => {
        console.log(info);
        res.json({info});
    });
};