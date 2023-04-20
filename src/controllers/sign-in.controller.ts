import { Request, Response } from 'express';

class SignInController {
  echo(req: Request, res: Response) {
    res.send('echo');
  }
}

export default SignInController;
