import express from 'express';
import chalk from 'chalk';

import middlewaresConfig from './config/express-middlewares';
import apis from './routes/index';

const app = express();

function response({
  type, message, data, code,
}) {
  const defaultCode = type === 'success' ? 200 : 500;
  return {
    code: code || defaultCode,
    message,
    data,
  };
}

middlewaresConfig.init(app);
app.use('/', apis);

app.response.success = function success(message, data, displayMessage, code) {
  // console.log(chalk.green(message));
  this
    .status(200)
    .send(response({
      type: 'success', message, data, code,
    }));
  // console.log(chalk.bgGreen(chalk.black('Exited with Success Response\n')));
};

app.response.error = function error(message, data, displayMessage, code) {
  // console.log(chalk.red(message));
  if (data) {
    console.log(chalk.red(data));
  }
  const resMessage = typeof message !== 'string' ? 'Something went wrong' : message;
  this
    .status(200)
    .send(response({
      type: 'error', message: resMessage, data, code,
    }));
  // console.log(chalk.bgRed(chalk.black('Exited with Error Response\n')));
};

// Catch thrown errors and send report to sentry
middlewaresConfig.trace(app);

export default app;
