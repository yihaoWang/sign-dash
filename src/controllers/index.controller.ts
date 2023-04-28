import { NextFunction, Request, Response } from 'express';

class IndexController {
  /**
   * @openapi
   * /:
   *   get:
   *     description: landing page, sign up or sign in to the app, redirect to dashboard if you already signed in
   *     responses:
   *       200:
   *         description: render landing page
   *       500:
   *         description: Internal server error.
   */
  rednerHomePage(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.session.user) {
        return res.redirect('/dashboard');
      }

      res.render('index', { title: 'sing-dash' });
    } catch (err) {
      next(err);
    }
  }
}

export default IndexController;
