const apiRandom = require('../components/api-random/index');
const UsersRegistro = require('../components/users/UsersRegistro');
const UsersLogin = require('../components/users/UsersLogin');
const productTestController = require('../components/productTest/ProductTestController');
const info = require('../components/info/index');
const authenticateToken = require('../utils/authenticateToken');
const logger = require('../utils/winston/index');

let user = '';

module.exports = (app) => {
    productTestController(app);
    UsersRegistro(app);
    UsersLogin(app);
    apiRandom(app);
    info(app);

    app.use('/auth', authenticateToken, (req, res) => {
        user = req.user;
        res.send('Usuario validado');

    });

    app.get('/', (req, res) => {
        if(user === ''){
            return res.redirect('login')
        }
        res.render('index', {email: user[0].email })
    });
    app.get('logout', (req, res) => {
        res.render('logout')
    });

    app.get('*', (req, res) => {
        logger.log('warn', `ruta no encontrada ${req.url}`);
        res.status(404).json({
            error: -2,
            description: `ruta  ${req.url} metodo get no implementado`
        });
    });
};