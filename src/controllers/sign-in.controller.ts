import { Request, Response } from 'express';
import config from 'config';

const DOMAIN = config.get('app.domain');
const GOOGLE_CLIENT_ID = config.get('auth.google.clientId');
const GOOGLE_AUTH_CALLBACK_POSTFIX = config.get('auth.google.callbackUrl');
const GOOGLE_AUTH_CALLBACK = `${DOMAIN}${GOOGLE_AUTH_CALLBACK_POSTFIX}`;

class SignInController {
  renderSignInPage(req: Request, res: Response) {
    res.render('signin', {
      title: 'sing-dash',
      googleAuthCallback: GOOGLE_AUTH_CALLBACK,
      googleClientId: GOOGLE_CLIENT_ID,
    });
  }
}

export default SignInController;
