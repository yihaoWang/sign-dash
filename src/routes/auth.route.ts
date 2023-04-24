import AuthController from '../controllers/auth.controller';
import Route from './route';
import { requireAuthentication } from '../middlewares/auth.middleware';

class AuthRoute extends Route {
  private authController = new AuthController();

  constructor() {
    super();
    this.prefix = '/auth';
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.post('/google/callback', this.authController.googleAuthCallback.bind(this.authController));
    this.router.post('/email-login', this.authController.loginByEmail.bind(this.authController));
    this.router.get('/email-verification', this.authController.verifyVerificationCode.bind(this.authController));
    this.router.get('/active-account', requireAuthentication(false), this.authController.renderActiveAccountPage.bind(this.authController));
    this.router.post('/resend-account-verification', requireAuthentication(false), this.authController.resendAccountVerification.bind(this.authController));
  }
}

export default AuthRoute;
