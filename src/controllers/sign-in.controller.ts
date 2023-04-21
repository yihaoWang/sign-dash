import { Request, Response } from 'express';

class SignInController {
  renderSignInPage(req: Request, res: Response) {
    res.render('signin', { title: 'sing-dash' });
  }
}

export default SignInController;
