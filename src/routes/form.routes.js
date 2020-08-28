import { Router } from 'express';
import FormController from '../controllers/form.controller';
import ResponseApis from './response.routes';

let routes = Router();

routes.use('/:id/responses', (req, res, next) => {
    let id = req.params.id;
    req.form = {
        id
    }
    next();
}, ResponseApis);

routes.get('/', FormController.list);
routes.get('/:id', FormController.fetch);
routes.post('/create', FormController.create);
routes.put('/:id/save', FormController.edit);
routes.delete('/:id', FormController.remove);
//export
//import

export default routes;