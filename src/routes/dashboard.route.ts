import DashboardController from '../controllers/dashboard.controller';
import Route from './route';
import { requireAuthentication } from '../middlewares/auth.middleware';

class DashboardRoute extends Route {
  private dashboardController = new DashboardController();

  constructor() {
    super();
    this.prefix = '/dashboard';
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get('/', requireAuthentication(), this.dashboardController.rednerDashboardPage.bind(this.dashboardController));
  }
}

export default DashboardRoute;
