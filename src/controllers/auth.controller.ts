import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import config from '../config';
import AccountModule from '../modules/account.module';
import EmailSender from '../modules/email-sender.module';
import SessionModel from '../modules/session.module';

const GOOGLE_CLIENT_ID = config.googleAuth.clientId;

class AuthController {
  /**
   * @openapi
   * /auth/google/callback:
   *   post:
   *     description: Google oauth callback
   *     parameters:
   *       - name: credential
   *         description: credential to use for google login.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: login successful and redirect to /dashboard
   *       400:
   *         description: Bad parameters.
   *       500:
   *         description: Internal server error.
   */
  async googleAuthCallback(req: Request, res: Response, next: NextFunction) {
    try{
      const token: string = req.body.credential;
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
      } else {
        await AccountModule.updateAccountById(account.id, {
          login_count: account.login_count + 1,
          last_session_at: new Date(),
        });
      }

      SessionModel.setUserSession(req, account);
      res.redirect('/dashboard');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /auth/fb/callback:
   *   post:
   *     description: Facebook oauth callback.
   *     parameters:
   *       - name: userID
   *         description: User ID to use for facebook login.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: accessToken
   *         description: Access Token to use for facebook login.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: login successful and redirect to /dashboard.
   *       500:
   *         description: Internal server error.
   */
  async facebookAuthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const userID: string = req.body.userID;
      const accessToken: string = req.body.accessToken;
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
      } else {
        await AccountModule.updateAccountById(account.id, {
          login_count: account.login_count + 1,
          last_session_at: new Date(),
        });
      }

      SessionModel.setUserSession(req, account);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /auth/email-verification:
   *   get:
   *     description: active account by email verification code.
   *     parameters:
   *       - name: code
   *         description: verification code for active account.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: successful and redirect to /dashboard.
   *       400:
   *         description: Bad parameters.
   *       500:
   *         description: Internal server error.
   */
  async verifyVerificationCode(req: Request, res: Response, next: NextFunction) {
    try {
      const code: string = req.query.code as string

      if (!code) {
        return res.status(400).send({ error: 'Invalid verification code' });
      }

      try {
        await AccountModule.verifyVerificationCode(code);

        res.redirect('/dashboard');
      } catch (error) {
        res.sendStatus(500);
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /auth/active-account:
   *   get:
   *     description: Render active account page.
   *     responses:
   *       200:
   *         description: render active account page.
   *       500:
   *         description: Internal server error.
   */
  renderActiveAccountPage(req: Request, res: Response, next: NextFunction) {
      try {
        res.render('active-account');
      } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /auth/resend-account-verification:
   *   get:
   *     description: re-send verification code.
   *     responses:
   *       200:
   *         description: successful and redirect to /dashboard.
   *       400:
   *         description: Bad parameters.
   *       500:
   *         description: Internal server error.
   */
  async resendAccountVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.session.user?.email;

      if (!email) {
        return res.status(400).json({ message: 'Bad request.' });
      }
      const verificationCode = await AccountModule.createVerificationCode(email);

      await EmailSender.sendVerificationEmail(email, verificationCode);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
