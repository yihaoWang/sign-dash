import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import config from '../config';
import AccountModule from '../modules/account.module';
import SessionModel from '../modules/session.module';

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

  async loginByEmail(req: Request, res: Response) {
    const { email, password } = req.body;
    const account = await AccountModule.getAccountByEmail(email);

    if (!account || !account.password) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    if (!bcrypt.compareSync(password, account.password)) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    await AccountModule.updateAccountById(account.id, {
      login_count: account.login_count + 1,
      last_session_at: new Date(),
    });
    SessionModel.setUserSession(req, account);
    res.sendStatus(200);
  }
}

export default SignInController;
