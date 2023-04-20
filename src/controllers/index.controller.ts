import { Request, Response } from "express";

class IndexController {
  echo(req: Request, res: Response) {
    res.send('echo');
  }
}

export default IndexController;