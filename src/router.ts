import Route from './routes/route';
import IndexRoute from './routes/index.route';
import SignInRoute from './routes/sign-in.route';
import SignUpRoute from './routes/sign-up.route';
import AuthRoute from './routes/auth.route';
import DashboardRoute from './routes/dashboard.route';
import LogoutRoute from './routes/logout.route';
import AccountRoute from './routes/account.route';

const router: Array<Route> = [
  new IndexRoute(),
  new SignInRoute(),
  new SignUpRoute(),
  new AuthRoute(),
  new DashboardRoute(),
  new LogoutRoute(),
  new AccountRoute(),
];

export default router;
