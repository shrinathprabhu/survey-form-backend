import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';

export default function (app) {
    app.use(morgan('tiny'));
    app.use(compression());
    app.use(cors());
    app.use(helmet());
    app.use(methodOverride());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
}