const jwt = require('jsonwebtoken');
const KEY_JWT = process.env.PRIVATE_KEY;

module.exports = function generateToken(user){
    const token = jwt.sign({data : user}, KEY_JWT, {expiresIn: '1d'});
    return token;
}