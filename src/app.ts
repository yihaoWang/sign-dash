import path from 'path';
import express from 'express';
import session from 'express-session';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import {createClient} from 'redis'
import RedisStore from 'connect-redis'

import router from './router';
import { IUserSession } from './modules/session.module';
import config from './config';

declare module 'express-session' {
  interface SessionData {
    user: IUserSession;
    lastSessionAt: number,
  }
}
//
const options = {
  swaggerDefinition: {
    info: {
      title: 'Sign Dash API Documentation',
      version: '1.0.0',
      description: 'Sign Dash API Documentation'
    }
  },
  apis: ['./src/controllers/*.ts']
};
const specs = swaggerJsdoc(options);

// Initial Redis
const redisClient = createClient({
  url: config.redis.url
});
redisClient.connect().catch(console.error)

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

const app:express.Application = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));``
app.use(session({
  store: redisStore,
  secret: config.app.sessionSecret,
  resave: false,
  saveUninitialized: false
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

router.forEach((route) => {
  app.use(route.getPrefix(), route.getRouter());
});

export default app;
