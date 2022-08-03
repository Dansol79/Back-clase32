const Users = require('./UsersSchema');
const {Router} = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const isRegistered = require('../../utils/isRegistered');
const logger = require('../../utils/winston/index');

module.exports = (app) => {
    app.use('/registro', router);

    router.get('/', (req, res) => {
        logger.log('info', `ruta /registro, metodo get`);
        res.render('registro');
    });

    router.post('/', isRegistered, async (req, res) => {
        logger.log('info', `ruta /registro, metodo post`);
        try{
            const {email, password} = req.body;
            if(!email || !email.length){
                res.status(401).json({error:'No se envió un nombre para el Login'});
                return;
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = {
                email: email,
                password: hashedPassword
            };
            await Users.create(newUser);
            res.redirect('/login');
            
        }catch(error){
            console.log(error);
        }
    })
}