import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import useragent from 'useragent';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import constants from './constants';

function validateCookie(cookie) {
  try {
    const parsedCookie = JSON.parse(cookie);
    if (new Date(parsedCookie.expiry) < new Date()) {
      return { isValid: false, parsedCookie };
    }
    return { isValid: true };
  } catch (e) {
    return { isValid: false };
  }
}

function createAndSetUID(res, parsedCookie) {
  const cookieExpiry = constants.hour / 12;
  let cookieUID;
  if (parsedCookie) {
    cookieUID = parsedCookie.uid;
  } else {
    cookieUID = uuidv4();
  }
  const uid = JSON.stringify({
    uid: cookieUID,
    expiry: new Date(Date.now() + cookieExpiry),
  });
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
      const validation = validateCookie(cookie);
      if (!validation.isValid) {
        if (validation.parsedCookie) cookie = createAndSetUID(res, validation.parsedCookie);
        else cookie = createAndSetUID(res);
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
    res.error(e);
  }
}

function detectAndAvoidBots(req, res, next) {
  /** Inspired from https://antoinevastel.com/bot/2020/05/10/express-middleware-bot.html */
  const botPatterns = [
    /HeadlessChrome/,
    /[wW]get/,
    /Python-urllib/,
    /phpcrawl/,
    /PhantomJS/,
    /curl/,
  ];

  if (process.env.NODE_ENV !== 'development') {
    botPatterns.push(/PostmanRuntime/);
  }

  const userAgent = req.headers['user-agent'];

  const isBot = botPatterns.find((botPattern) => userAgent.match(botPattern));
  if (isBot) {
    return res
      .status(406)
      .send("Sorry, currently we don't support bots and crawlers");
  }
  return next();
}

export default {
  init: function init(app) {
    app.use(detectAndAvoidBots);
    app.use(morgan('tiny'));
    app.use(compression());
    app.use(
      cors({
        origin: [
          'https://openforms.herokuapp.com',
          'http://localhost:8080',
          /http:\/\/192\.168\.0\.[0-9]:8080/,
        ],
        credentials: true,
      }),
    );
    app.use(helmet());
    // Starting sentry handlers
    if (constants.nodeEnv === 'production') {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Tracing.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
      });
      app.use(Sentry.Handlers.requestHandler());
      app.use(Sentry.Handlers.tracingHandler());
    }
    app.use(cookieParser(constants.cookieSecret));
    app.use(secureClient);
    app.use(methodOverride());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
  },
  trace: function trace(app) {
    app.use(Sentry.Handlers.errorHandler());
  },
};
