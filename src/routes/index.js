import { Router } from 'express';

import FormApis from '../routes/form.routes';

const routes = Router();

routes.use('/forms', FormApis);

routes.all('*', (req, res, next) => {
    // Handle 404
    res.json({ code: 404 });
});

export default routes;