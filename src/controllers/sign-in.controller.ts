import { Request, Response } from 'express';
import config from '../config';

const DOMAIN = config.app.domain;
const GOOGLE_CLIENT_ID = config.googleAuth.clientId;
const GOOGLE_AUTH_CALLBACK_POSTFIX = config.googleAuth.callbackUrl;
const GOOGLE_AUTH_CALLBACK = `${DOMAIN}${GOOGLE_AUTH_CALLBACK_POSTFIX}`;

class SignInController {
  renderSignInPage(req: Request, res: Response) {
    res.render('signin', {
      title: 'sing-dash',
      googleAuthCallback: GOOGLE_AUTH_CALLBACK,
      googleClientId: GOOGLE_CLIENT_ID,
    });
  }

  logout(req: Request, res: Response) {
    req.session.user = undefined;
    res.redirect('/');
  }
}

export default SignInController;
