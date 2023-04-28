import { Request, Response } from 'express';

class LogoutController {
  /**
   * @openapi
   * /logout:
   *   get:
   *     description: logout
   *     responses:
   *       200:
   *         description: logout user and redirect to landing page
   */
    logout(req: Request, res: Response) {
      req.session.user = undefined;
      res.redirect('/');
    }
}

export default LogoutController;
