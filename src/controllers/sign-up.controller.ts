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

  /**
   * @openapi
   * /signup/:
   *   get:
   *     description: Render sign up page.
   *     responses:
   *       200:
   *         description: Render sign up page.
   */
  renderSignUpPage(req: Request, res: Response) {
    res.render('signup', {
      title: 'sing-dash',
      googleAuthCallback: GOOGLE_AUTH_CALLBACK,
      googleClientId: GOOGLE_CLIENT_ID,
    });
  }

  async isAccountExists(email: string): Promise<Boolean> {
    return Boolean(await AccountModule.getAccountByEmail(email));
  }

 /**
   * @openapi
   * /signup/account:
   *   post:
   *     description: Facebook oauth callback.
   *     parameters:
   *       - name: email
   *         description: email to use for login.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         description: password to use for login.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: confirmedPassword
   *         description: Confirmed password to use for checking password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: create account by email.
   *       400:
   *         description: Bad parameters.
   *       500:
   *         description: Internal server error.
   */
  async createAccount(req: Request, res: Response) {
    const { email, password, confirmedPassword } = req.body;

    if (!email ||!password ||!confirmedPassword) {
      return res.status(400).json({ message: 'Please check eamil and password are valid' });
    }
    if (password !== confirmedPassword) {
      return res.status(400).json({ message: 'Please check the passwords are the same' });
    }

    if (!AccountModule.isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.' });
    }

    if (await this.isAccountExists(email)) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const account = await AccountModule.createAccount({
      email: email,
      password: bcrypt.hashSync(password, 10),
      register_from: 'email',
      login_count: 1,
      last_session_at: new Date(),
    });
    SessionModel.setUserSession(req, account);
    const verificationCode = await AccountModule.createVerificationCode(email);

    await EmailSender.sendVerificationEmail(email, verificationCode);
    res.sendStatus(200);
  }
}

export default SignUpController;
