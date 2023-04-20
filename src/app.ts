import express from 'express';
import morgan from 'morgan';
import router from './router';

const app:express.Application = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.forEach((route) => {
  app.use(route.getPrefix(), route.getRouter());
});

export default app;
