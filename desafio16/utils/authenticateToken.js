const jwt = require('jsonwebtoken');
require('dotenv').config();
const KEY_JWT = process.env.PRIVATE_KEY;

module.exports = function generateToken(req, res, next){
    const authHeader = req.headers.authorization
    console.log(authHeader);

    if(!authHeader){
        return res.status(401).json({error: 'No autenticado'});
    }

    const token = authHeader.split(' ')[1];
    console.log(token);

    jwt.verify(token, KEY_JWT, (err, decoded) => {
        if(err){
            return res.status(403).json({error: 'No autorizado'});
        }

        req.user = decoded.data;
        next();
    });
};
