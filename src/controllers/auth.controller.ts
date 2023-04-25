import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import config from '../config';
import AccountModule from '../modules/account.module';
import EmailSender from '../modules/email-sender.module';
import SessionModel from '../modules/session.module';

const GOOGLE_CLIENT_ID = config.googleAuth.clientId;

class AuthController {
  async googleAuthCallback(req: Request, res: Response) {
    const token = req.body.credential;
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    res.send(JSON.stringify(payload));
  }

  async verifyVerificationCode(req: Request, res: Response) {
    const code: string = req.query.code as string

    if (!code) {
      return res.status(400).send({ error: 'Invalid verification code' });
    }

    try {
      await AccountModule.verifyVerificationCode(code);

      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
    }
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
    res.sendStatus(200);
  }

  renderActiveAccountPage(req: Request, res: Response) {
    res.render('active-account');
  }

  async resendAccountVerification(req: Request, res: Response) {
    const email = req.session.user?.email;

    if (!email) {
      return res.status(400).json({ message: 'Bad request.' });
    }
    const verificationCode = await AccountModule.createVerificationCode(email);

    await EmailSender.sendVerificationEmail(email, verificationCode);
    res.sendStatus(200);
  }
}

export default AuthController;
