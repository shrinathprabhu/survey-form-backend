import express from 'express';
import chalk from 'chalk';
import http from 'http';

import middlewaresConfig from './config/express-middlewares';
import apis from './routes/index';
import constants from './config/constants';

const app = express();

middlewaresConfig(app);
app.use('/', apis);

app.response.success = function (message, data, displayMessage, code) {
    console.log(chalk.green(message));
    this
        .status(200)
        .send(response('success', message, data, displayMessage, code));
    console.log(chalk.bgGreen(chalk.black("Exited with Success Response\n")));
}

app.response.error = function (message, data, displayMessage, code) {
    console.log(chalk.red(message));
    if (data) {
        console.log(chalk.red(data));
    }
    message = typeof message != 'string' ? 'Something went wrong' : message;
    this
        .status(200)
        .send(response('error', message, data, displayMessage, code));
    console.log(chalk.bgRed(chalk.black("Exited with Error Response\n")));
}

function response(type, message, data, displayMessage, code) {
    let defaultCode = type === 'success' ? 200 : 500;
    return {
        code: code || defaultCode,
        message,
        data,
        displayMessage
    }
}

let server = http.createServer(app);

server.listen(constants.port);

server.on('listening', () => console.log('Server started and is listening on port ' + constants.port));
server.on('error', error => console.log(error));