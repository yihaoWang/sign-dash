import LogoutController from '../controllers/logout.controller';
import Route from './route';

class LogoutRoute extends Route {
  private logoutController = new LogoutController();

  constructor() {
    super();
    this.prefix = '/logout';
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get('/', this.logoutController.logout.bind(this.logoutController));
  }
}

export default LogoutRoute;
