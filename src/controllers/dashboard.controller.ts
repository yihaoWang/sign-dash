import { Request, Response } from 'express';

class DashboardController {
  rednerDashboardPage(req: Request, res: Response) {
    res.send('dashboard page');
  }
}

export default DashboardController;
