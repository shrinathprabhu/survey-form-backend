require('dotenv').config();

const npsUtils = require('nps-utils');

const { rimraf, crossEnv, series, concurrent } = npsUtils;

module.exports = {
    scripts: {
        build: {
            description: 'Building in production environment.',
            default: series.nps('clean', 'build.build'),
            build: `parcel build src/bin/server.js --target node`,
        },
        clean: {
            description: 'Clean dist folder.',
            default: concurrent.nps(rimraf('dist'), rimraf('.cache')),
        },
        default: {
            description: 'Start project with pm2 on production.',
            script: `${crossEnv('NODE_ENV=production')} pm2 start processes.json`,
        },
        dev: {
            start: {
                description: 'Running on dev environment.',
                script: `${crossEnv('NODE_ENV=development')} nodemon -r dotenv/config dist/server.js`,
            },
            default: {
                script: concurrent.nps('dev.watch', 'dev.start'),
            },
            watch: {
                description: 'Parcel watch for change and compile.',
                script: `${crossEnv('NODE_ENV=development')} parcel watch src/bin/server.js --target node`,
            },
            withDebug: {
                script: `${crossEnv('NODE_ENV=development')} MONGOOSE_DEBUG=true DEBUG=express:* nodemon -r dotenv/config dist/server.js`,
            },
            debug: {
                description: 'Running on dev environment with debug on.',
                script: concurrent.nps('dev.watch', 'dev.withDebug'),
            },
        },
        lint: {
            default: 'eslint src',
            fix: 'eslint --fix src',
        }
    }
}