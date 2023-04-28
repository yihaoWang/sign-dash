import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
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

    if (!payload || !payload.email || !payload.name) {
      return res.status(400).json({ error: 'invalid token' });
    }

    let account = await AccountModule.getAccountByEmail(payload.email);

    if (!account) {
      account = await AccountModule.createAccount({
        email: payload.email,
        name: payload.name,
        register_from: 'google',
        login_count: 1,
        last_session_at: new Date(),
        google_id: payload.sub,
      });
    }

    SessionModel.setUserSession(req, account);
    res.redirect('/dashboard');
  }

  async facebookAuthCallback(req: Request, res: Response) {
    const userID = req.body.userID;
    const accessToken = req.body.accessToken;

    console.log(req.body);
    console.log('userID', userID);
    console.log('accessToken', accessToken);

    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/v16.0/${userID}`,
          {
          params: {
            access_token: accessToken,
            fields: 'id,name,email'
          }
        }
      );
      let account = await AccountModule.getAccountByEmail(data.email);

      if (!account) {
        account = await AccountModule.createAccount({
          email: data.email,
          name: data.name,
          register_from: 'facebook',
          login_count: 1,
          last_session_at: new Date(),
          google_id: data.sub,
        });
      }

      SessionModel.setUserSession(req, account);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
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
