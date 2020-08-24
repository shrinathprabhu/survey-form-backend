import { Router } from 'express';
import ResponseController from '../controllers/response.controller';

let routes = Router();

routes.get('/list', ResponseController.list);
routes.post('/submit', ResponseController.submit);
routes.get('/check-submission', ResponseController.isRecorded);

export default routes;