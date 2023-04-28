import { Request, Response } from 'express';

class IndexController {
  /**
   * @openapi
   * /:
   *   get:
   *     description: landing page, sign up or sign in to the app, redirect to dashboard if you already signed in
   *     responses:
   *       200:
   *         description: render landing page
   */
  rednerHomePage(req: Request, res: Response) {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }

    res.render('index', { title: 'sing-dash' });
  }
}

export default IndexController;
