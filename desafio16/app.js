const express = require('express');
const moment = require('moment');
const path = require('path');
const cors = require('cors');
const serverRoutes = require('./routes/index');
const { config } = require('./config/db');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const chatController = require('./components/chat/chatController');
const compression = require('compression');
const normalizar = require('./normalizr/index')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { mongodb } = require('./config/db');
const { YargObj } = require('./utils/yargs');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const logger = require('./utils/winston/index');

// Inicializacion
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// midleware
app.use(cors(`${config.cors}`));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// session 
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: mongodb.URL,
            mongoOptions: mongodb.options,

        }),
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60,
        },
        rolling: true,
    })
);

// Routes
serverRoutes(app);

// Socket
io.on('connection', async (socket) => {
    logger.log('info', `nuevo cliente conectado`)

    socket.emit('messages', normalizar(await chatController.listAll()));

    socket.on('message', async (message) => {
        const { author, text } = message;
        const newMessage = {
            author,
            text,
            fecha: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };
        await chatController.save({
            author: newMessage.author,
            text: newMessage.text,
            fecha: newMessage.fecha
        });
        io.sockets.emit('messsage', newMessage);
    });
});

const PORT = process.argv[2] || process.env.port || YargObj.port;
const mode = process.argv[3]?.toUpperCase() || YargObj.mode.toUpperCase();

if (mode === 'FORK') {
    const server = httpServer.listen(PORT, () => {
        logger.log(
            'info',
            `Servidor inicializado en el puerto ${server.address().port} con pid ${process.pid}`);
    });
    server.on('error', (err) => {
        logger.log('error', 'Error del servidor.' + err);
    });
    process.on('exit', (code) => {
        ogger.log('info',  'Exit code -> ' + code);
    });
};

if(mode === 'CLUSTER') {
    if(cluster.isMaster){
        console.log(`Master -> PID: ${process.pid}`);

        // Workers
        console.log('cpus..', numCPUs);
        for(let i = 0;  i < numCPUs; i++){
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            logger.log('info', `worker ${worker.process.pid} died`);
            cluster.fork();
        });
    }else{
        const server = httpServer.listen(PORT, () => {
            logger.log(
                'info',
                `Servidor inicializando en el puerto ${server.address().port} con pid ${process.pid}`
            );
        });
    }
}


