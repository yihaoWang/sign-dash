import { Request, Response } from 'express';

class LogoutController {
    logout(req: Request, res: Response) {
      req.session.user = undefined;
      res.redirect('/');
    }
}

export default LogoutController;
