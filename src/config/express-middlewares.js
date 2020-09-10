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
    app.use(compression());
    app.use((req, res, next) => {
        console.log(req.headers);
        next();
    });
    app.use(cors({
        origin: 'http://localhost:8080',
        credentials: true
    }));
    app.use(cookieParser(constants.cookieSecret));
    app.use(secureClient);
    app.use(helmet());
    app.use(methodOverride());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
}

function secureClient(req, res, next) {
    let cookie = req.signedCookies.uid;
    let cookieExpiry = constants.hour / 12;
    console.log("Cookie UID", cookie);
    if (cookie === undefined) {
        let uid = JSON.stringify({ uid: uuidv4(), expiry: new Date(Date.now() + cookieExpiry) });
        cookie = uid;
        res.cookie('uid', uid, { maxAge: constants.cookieMaxAge, signed: true, secret: constants.cookieSecret });
    } else {
        try {
            let parsedCookie = JSON.parse(cookie);
            if (new Date(parsedCookie.expiry) < new Date()) {
                let uid = JSON.stringify({ uid: parsedCookie.uid, expiry: new Date(Date.now() + cookieExpiry) });
                cookie = uid;
                res.cookie('uid', uid, { maxAge: constants.cookieMaxAge, signed: true, secret: constants.cookieSecret, httpOnly: true });
            }
        } catch (e) {
            let uid = JSON.stringify({ uid: uuidv4(), expiry: new Date(Date.now() + cookieExpiry) });
            cookie = uid;
            res.cookie('uid', uid, { maxAge: constants.cookieMaxAge, signed: true, secret: constants.cookieSecret });
        }
    }
    let clientUA = useragent.parse(req.headers['user-agent']);
    let ip = req.socket.remoteAddress;
    if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
    }
    let parsedCookie = JSON.parse(cookie);
    req.client = {
        userAgent: req.headers['user-agent'],
        browser: clientUA.family,
        os: clientUA.os.family,
        uid: parsedCookie.uid,
        ip
    }
    next();
}