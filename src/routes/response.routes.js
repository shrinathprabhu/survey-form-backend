import { Router } from 'express';
import * as ResponseController from '../controllers/response.controller';

const routes = Router();

routes.get('/list', ResponseController.list);
routes.post('/submit', ResponseController.submit);
routes.get('/check-submission', ResponseController.isRecorded);

export default routes;
