import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import useragent from 'useragent';
import constants from './constants';

function createAndSetUID(res, parsedCookie) {
  const cookieExpiry = constants.hour / 12;
  let cookieUID;
  if (parsedCookie) {
    cookieUID = parsedCookie.uid;
  } else {
    cookieUID = uuidv4();
  }
  const uid = JSON.stringify({ uid: cookieUID, expiry: new Date(Date.now() + cookieExpiry) });
  res.cookie('uid', uid, {
    maxAge: constants.cookieMaxAge,
    signed: true,
    secret: constants.cookieSecret,
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
  return uid;
}

function secureClient(req, res, next) {
  try {
    let cookie = req.signedCookies.uid;
    if (cookie === undefined) cookie = createAndSetUID(res);
    else {
      try {
        const parsedCookie = JSON.parse(cookie);
        if (new Date(parsedCookie.expiry) < new Date()) cookie = createAndSetUID(res, parsedCookie);
      } catch (e) {
        cookie = createAndSetUID(res);
      }
    }
    const clientUA = useragent.parse(req.headers['user-agent']);
    let ip = req.socket.remoteAddress;
    if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');
    const parsedCookie = JSON.parse(cookie);
    req.client = {
      userAgent: req.headers['user-agent'],
      browser: clientUA.family,
      os: clientUA.os.family,
      uid: parsedCookie.uid,
      ip,
    };
    next();
  } catch (e) {
    console.log(e);
    res.error(e);
  }
}

export default function expressMiddlewares(app) {
  app.use(morgan('tiny'));
  app.use(compression());
  app.use(cors({
    origin: ['https://openforms.herokuapp.com', 'http://localhost:8080', /http:\/\/192\.168\.0\.[0-9]:8080/],
    credentials: true,
  }));
  app.use(cookieParser(constants.cookieSecret));
  app.use(secureClient);
  app.use(helmet());
  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
}
