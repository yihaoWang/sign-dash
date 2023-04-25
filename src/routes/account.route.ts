import accountController from '../controllers/account.controller';
import Route from './route';

class AccountRoute extends Route {
  private accountController = new accountController();

  constructor() {
    super();
    this.prefix = '/account';
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.put('/name', this.accountController.updteName.bind(this.accountController));
    this.router.put('/password', this.accountController.updatePassword.bind(this.accountController));
  }
}

export default AccountRoute;
