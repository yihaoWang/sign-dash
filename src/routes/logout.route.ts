import LogoutController from '../controllers/logout.controller';
import { requireAuthentication } from '../middlewares/auth.middleware';
import Route from './route';

class LogoutRoute extends Route {
  private logoutController = new LogoutController();

  constructor() {
    super();
    this.prefix = '/logout';
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get('/', requireAuthentication(), this.logoutController.logout.bind(this.logoutController));
  }
}

export default LogoutRoute;
