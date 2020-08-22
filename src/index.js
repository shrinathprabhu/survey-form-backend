import express from 'express';
import chalk from 'chalk';
import http from 'http';

import middlewaresConfig from './config/express-middlewares';
import constants from './config/constants';

const app = express();

middlewaresConfig(app);

let server = http.createServer(app);

server.listen(constants.port);

server.on('listening', () => console.log('Server started and is listening on port ' + constants.port));
server.on('error', error => console.log(error));