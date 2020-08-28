import { Router } from 'express';

import FormApis from '../routes/form.routes';

const routes = Router();

routes.use('/forms', FormApis);

routes.all('*', (req, res, next) => {
    // Handle 404
    res.status(404).send({ code: 404, message: 'Endpoint not found' });
});

export default routes;