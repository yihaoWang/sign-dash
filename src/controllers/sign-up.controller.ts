import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import config from '../config';
import AccountModule from '../modules/account.module';
import EmailSender from '../modules/email-sender.module';
import SessionModel from '../modules/session.module';

const DOMAIN = config.app.domain;
const GOOGLE_CLIENT_ID = config.googleAuth.clientId;
const GOOGLE_AUTH_CALLBACK_POSTFIX = config.googleAuth.callbackUrl;
const GOOGLE_AUTH_CALLBACK = `${DOMAIN}${GOOGLE_AUTH_CALLBACK_POSTFIX}`;

class SignUpController {
  renderSignUpPage(req: Request, res: Response) {
    res.render('signup', {
      title: 'sing-dash',
      googleAuthCallback: GOOGLE_AUTH_CALLBACK,
      googleClientId: GOOGLE_CLIENT_ID,
    });
  }

  isValidPassword(password: string): Boolean {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+[\]{};':"\\|,.<>\/?]).{8,}$/;

    return regex.test(password);
  }

  async isAccountExists(email: string): Promise<Boolean> {
    return Boolean(await AccountModule.getAccountByEmail(email));
  }

  async createAccount(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!this.isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.' });
    }

    if (await this.isAccountExists(email)) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }


    const account = await AccountModule.create({
      email: email,
      password: bcrypt.hashSync(password, 10),
      register_from: 'email',
    });
    SessionModel.setUserSession(
      req,
      {
        id: account.id,
        email: account.email,
        name: account.name || '',
        emailVerified: account.email_verified || false,
        from: account.register_from,
      }
    );
    const verificationCode = await AccountModule.createVerificationCode(email);

    await EmailSender.sendVerificationEmail(email, verificationCode);
    res.sendStatus(200);
  }
}

export default SignUpController;
