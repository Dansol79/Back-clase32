const {normalize, schema} = require('normalizr');

const author = new schema.Entity('authors', {}, {idAttribute: 'email'});
const text = new schema.Entity('texts', {author: author}, {idAttribute: 'id'});
const messagesCenter = new schema.Entity('messagesCenter', {
    authors: [author],
    messages: [text]
}, {idAttribute: 'id'});

module.exports = function normalizar(mensaje){
    const normalizar = mensaje.map((message) => ({
        author: message.author,
        fecha: message.fecha,
        text: message.text,
        id: message._id.toString(),
    }));

    const normalizados = normalize(
        {id: 'mensajes', messages: normalizar},
        messagesCenter
    );
    return normalizados;
}