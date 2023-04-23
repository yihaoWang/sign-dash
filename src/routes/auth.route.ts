import AuthController from '../controllers/auth.controller';
import Route from './route';

class AuthRoute extends Route {
  private authController = new AuthController();

  constructor() {
    super();
    this.prefix = '/auth';
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.post('/google/callback', this.authController.googleAuthCallback.bind(this.authController));
  }
}

export default AuthRoute;
