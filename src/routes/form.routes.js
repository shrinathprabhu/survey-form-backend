import { Router } from 'express';
import FormController from '../controllers/form.controller';
import ResponseApis from './response.routes';

let routes = Router();

routes.get('/', FormController.list);
routes.get('/:id', FormController.fetch);
routes.post('/create', FormController.create);
routes.put('/:id/save', FormController.edit);
routes.delete('/:id', FormController.remove);
//export
//import

routes.use('/:id/response', (req, res, next) => {
    let id = req.params.id;
    res.locals.form = {
        id
    }
    next();
}, ResponseApis);

export default routes;