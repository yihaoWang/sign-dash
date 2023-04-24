import path from 'path';
import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import router from './router';
import { IUserSession } from './modules/session.module';
import config from './config';

declare module 'express-session' {
  interface SessionData {
    user: IUserSession;
  }
}

const app:express.Application = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: config.app.sessionSecret,
  resave: false,
  saveUninitialized: false
}));

app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');

router.forEach((route) => {
  app.use(route.getPrefix(), route.getRouter());
});

export default app;
