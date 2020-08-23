import { Router } from 'express';
import FormController from '../controllers/form.controller';

let routes = Router();

routes.get('/', FormController.list);
routes.get('/:id', FormController.fetch);
routes.post('/create', FormController.create);
routes.put('/:id/save', FormController.edit);
routes.delete('/:id', FormController.remove);

export default routes;