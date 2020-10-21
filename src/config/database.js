/* eslint-disable no-console */
import mongoose from "mongoose";
import chalk from "chalk";
import constants from "./constants";

const mongoOptions = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
};

const conn = mongoose.createConnection(constants.mongoUrl, mongoOptions);

conn.mongo = mongoose.mongo;

conn.on("error", (err) => {
	console.log(chalk.bgRed("Error connecting to database"));
	console.log(chalk.red(err));
	console.log(
		chalk.bgRed(
			chalk.bold(
				chalk.yellow("Resolve the issues and restart server again")
			)
		)
	);
});

conn.on("connected", () => {
	console.log(chalk.green(chalk.bold("Connected to database")));
});

export default conn;
