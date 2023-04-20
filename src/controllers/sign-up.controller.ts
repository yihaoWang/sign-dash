import { Request, Response } from 'express';

class SignUpController {
  echo(req: Request, res: Response) {
    res.send('echo');
  }
}

export default SignUpController;
