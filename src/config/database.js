import mongoose from 'mongoose';
import constants from './constants';
import chalk from 'chalk';

let mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}

const conn = mongoose.createConnection(constants.mongoUrl, mongoOptions);

conn.mongo = mongoose.mongo;

conn.on('error', function (err) {
    console.log(chalk.bgRed('Error connecting to database'));
    console.log(chalk.red(err));
    console.log(chalk.bgRed(chalk.bold(chalk.yellow("Resolve the issues and restart server again"))));
});

conn.on('connected', function () {
    console.log(chalk.green(chalk.bold('Connected to database')));
});

export default conn;