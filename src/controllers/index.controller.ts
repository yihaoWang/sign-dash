import { Request, Response } from 'express';

class IndexController {
  rednerHomePage(req: Request, res: Response) {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }

    res.render('index', { title: 'sing-dash' });
  }
}

export default IndexController;
