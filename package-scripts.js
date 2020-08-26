require('dotenv').config();

const npsUtils = require('nps-utils');

const { rimraf, crossEnv, series, concurrent } = npsUtils;

module.exports = {
    scripts: {
        dev: {
            start: {
                description: 'Running on dev environment.',
                script: `${crossEnv('NODE_ENV=development')} nodemon -r dotenv/config dist/index.js`,
            },
            default: {
                script: concurrent.nps('dev.watch', 'dev.start'),
            },
            watch: {
                description: 'Parcel watch for change and compile.',
                script: 'NODE_ENV=development parcel watch src/index.js --target node',
            },
        },
    }
}

// "NODE_ENV=development parcel build src/index.js --target node && nodemon -r dotenv/config dist/index.js"