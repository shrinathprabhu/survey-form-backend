import http from 'http';
import https from 'https';
import { readFileSync } from 'fs';
import constants from '../config/constants';
import app from '../index';

let server;

let isProductionEnv = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod';
let isHttps;

if (isProductionEnv && (constants.ssl.key && constants.ssl.cert)) {
    isHttps = true;
    server = https.createServer({
        key: readFileSync(constants.ssl.key, 'utf8'),
        cert: readFileSync(constants.ssl.cert, 'utf8')
    }, app);
} else {
    isHttps = false;
    server = http.createServer(app);
}

server.listen(constants.port);

server.on('listening', () => console.log(`${isHttps ? 'Https' : 'Http'} server started and is listening on port ${constants.port}`));
server.on('error', error => console.log(error));