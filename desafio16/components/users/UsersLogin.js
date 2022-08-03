const Users = require('./UsersSchema');
const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const generateToken = require('../../utils/generateToken');
const logger = require('../../utils/winston/index');
const UsersRegistro = require('./UsersRegistro');

module.exports = (app) => {
    app.use('/login', router);

    router.get('/', (req, res) => {
        logger.log('info', `ruta /login metodo get`);
        res.render('login');
    });

    router.post('/', async (req, res) => {
        logger.log('info', `ruta /login metodo post`);

        const { email, password } = req.body;
        if(!email || !email.length){
            res.status(401).send();
            return;
        }

        try{
            const user = await Users.find({email: email});
            const confirmPassword = await bcrypt.compare(password, user[0].password);
            if(!confirmPassword){
                return res.render('login-error');
            }

            const access_Token = generateToken(user);
            res.json({access_Token});
        }catch(error){
            console.log(error);
        }
    })
}