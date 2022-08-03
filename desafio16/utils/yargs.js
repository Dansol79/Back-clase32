const yarg = require('yargs');

let options = {
    default: {
        port: 8080,
        mode: 'FORK'
    },
    alias: {
        p: 'port',
        m: 'mode'
    },
};

const YargObj = yarg(process.argv.slice(2)).default(options.default).alias(options.alias).argv;

module.exports = { YargObj };