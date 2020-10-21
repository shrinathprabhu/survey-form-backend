import { Router } from "express";

import FormApis from "./form.routes";

const routes = Router();

routes.use("/forms", FormApis);

routes.all("*", (req, res) => {
	res.status(404).send({ code: 404, message: "Endpoint not found" });
});

export default routes;
