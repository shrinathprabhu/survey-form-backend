import express from 'express';
import chalk from 'chalk';

import middlewaresConfig from './config/express-middlewares';
import apis from './routes/index';

const app = express();

middlewaresConfig(app);
app.use('/', apis);

app.response.success = function (message, data, displayMessage, code) {
    console.log(chalk.green(message));
    this
        .status(200)
        .send(response({ type: 'success', message, data, displayMessage, code }));
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
        .send(response({ type: 'error', message, data, displayMessage, code }));
    console.log(chalk.bgRed(chalk.black("Exited with Error Response\n")));
}

function response({ type, message, data, displayMessage, code }) {
    let defaultCode = type === 'success' ? 200 : 500;
    return {
        code: code || defaultCode,
        message,
        data,
        displayMessage
    }
}

export default app;