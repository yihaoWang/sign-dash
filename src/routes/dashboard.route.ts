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
    this.router.get(['/', '/profile'], requireAuthentication(false), this.dashboardController.rednerProfilePage.bind(this.dashboardController));
    this.router.get('/statistics', requireAuthentication(), this.dashboardController.rednerStatisticsPage.bind(this.dashboardController));
  }
}

export default DashboardRoute;
