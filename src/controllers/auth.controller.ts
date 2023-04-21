import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import config from 'config';

const CLIENT_ID: string = config.get('auth.google.clientId');

class AuthController {
  async googleAuthCallback(req: Request, res: Response) {
    const token = req.body.credential;
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    res.send(JSON.stringify(payload));
  }
}

export default AuthController;
