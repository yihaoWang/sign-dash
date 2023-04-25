import SignInController from '../controllers/sign-in.controller';
import Route from './route';

class SignInRoute extends Route {
  private signInController = new SignInController();

  constructor() {
    super();
    this.prefix = '/signin';
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get('/', this.signInController.renderSignInPage.bind(this.signInController));
    this.router.post('/email-login', this.signInController.loginByEmail.bind(this.signInController));
  }
}

export default SignInRoute;
