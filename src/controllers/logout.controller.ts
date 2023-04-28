import { NextFunction, Request, Response } from 'express';

class LogoutController {
  /**
   * @openapi
   * /logout:
   *   get:
   *     description: logout
   *     responses:
   *       200:
   *         description: logout user and redirect to landing page
   *       500:
   *         description: Internal server error.
   */
    logout(req: Request, res: Response, next: NextFunction) {
      try {
        req.session.user = undefined;
        res.redirect('/');
      } catch (err) {
        next(err);
      }
    }
}

export default LogoutController;
