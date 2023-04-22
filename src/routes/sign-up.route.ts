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
    this.router.get('/', this.signUpController.renderSignUpPage);
    this.router.post('/user', this.signUpController.createAccount);
  }
}

export default SignUpRoute;
