import Route from './routes/route';
import IndexRoute from './routes/index.route';
import SignInRoute from './routes/sign-in.route';
import SignUpRoute from './routes/sign-up.route';

const router: Array<Route> = [
  new IndexRoute(),
  new SignInRoute(),
  new SignUpRoute(),
];

export default router;
