import SignUpController from '../controllers/sign-up.controller';
import Route from './route';

class SignUpRoute extends Route {
  private signUpController = new SignUpController();

  constructor() {
    super();
    this.prefix = '/signup';
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get('/', this.signUpController.renderSignUpPage.bind(this.signUpController));
    this.router.post('/account', this.signUpController.createAccount.bind(this.signUpController));
  }
}

export default SignUpRoute;
