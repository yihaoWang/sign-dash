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
    this.router.get('/', this.signInController.renderSignInPage);
  }
}

export default SignInRoute;
