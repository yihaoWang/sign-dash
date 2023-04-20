import { Request, Response } from 'express';

class IndexController {
  rednerHomePage(req: Request, res: Response) {
    res.render('index', { title: 'sing-dash' });
  }
}

export default IndexController;
