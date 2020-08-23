import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import constants from './constants';
import useragent from 'useragent';

export default function (app) {
    app.use(morgan('tiny'));
    app.use(cookieParser(constants.cookieSecret));
    app.use(function (req, res, next) {
        let cookie = req.signedCookies.uid;
        if (cookie === undefined) {
            res.cookie('uid', uuidv4(), { maxAge: constants.cookieMaxAge, signed: true, secret: constants.cookieSecret });
        }
        let clientUA = useragent.parse(req.headers['user-agent']);
        let ip = req.socket.remoteAddress;
        if (ip.startsWith("::ffff:")) {
            ip = ip.replace("::ffff:", "");
        }
        res.locals.client = {
            userAgent: req.headers['user-agent'],
            browser: clientUA.family,
            os: clientUA.os.family,
            uid: req.signedCookies.uid,
            ip
        }
        next();
    });
    app.use(compression());
    app.use(cors());
    app.use(helmet());
    app.use(methodOverride());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
}