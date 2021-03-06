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
            default: rimraf('dist'),
            dev: series(rimraf('dist'), rimraf('.cache'), rimraf('isolate-*.log'), rimraf('flamegraph.htm*'))
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
            build: {
                script: series.nps('clean.dev', 'dev.build.build'),
                build: `${crossEnv('NODE_ENV=development')} parcel build src/bin/server.js --target node`
            },
            watch: {
                description: 'Parcel watch for change and compile.',
                script: `${crossEnv('NODE_ENV=development')} parcel watch src/bin/server.js --target node`,
            },
            withDebug: {
                script: `${crossEnv('NODE_ENV=development')} MONGOOSE_DEBUG=true DEBUG=express:* nodemon -r dotenv/config dist/server.js`,
            },
            flamegraph: {
                observe: `node --prof -r dotenv/config dist/server.js`,
                script: series.nps('dev.build', 'dev.flamegraph.parallel'),
                parallel: concurrent.nps('dev.flamegraph.observe', 'dev.flamegraph.serve'),
                serve: `wait-on isolate*.log && node --prof-process --preprocess -j isolate*.log | flamebearer`
            },
            debug: {
                description: 'Running on dev environment with debug on.',
                script: concurrent.nps('dev.watch', 'dev.withDebug'),
            },
        },
        doc: {
            default: "apidoc -i src",
            deploy: series('nps doc', `surge ./doc -d ${process.env.DOCS_WEBSITE}`),
        },
        heroku: {
            deploy: series.nps('heroku.build', 'heroku.start'),
            build: `${crossEnv('NODE_ENV=production')} parcel build src/bin/server.js --target node`,
            start: `pm2-runtime start ecosystem.config.js --env production`
        },
        lint: {
            default: 'eslint src',
            fix: 'eslint --fix src',
        },
        test: {
            description: 'Started tests',
            default: 'jest --coverage=true --forceExit --detectOpenHandles --colors'
        }
    }
}