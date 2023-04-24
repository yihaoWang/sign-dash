import { Request, Response } from 'express';

class DashboardController {
  rednerProfilePage(req: Request, res: Response) {
    res.render('dashboard-profile', {
      user: { email: 'example@gmail.com', name: 'Example User' },
    });
  }

  rednerStatisticsPage(req: Request, res: Response) {
    res.render('dashboard-statistics', {
      users: [
        { email: 'example@gmail.com', name: 'Example User', timestamp: new Date(), loginCount: 1, lastSession: new Date() },
        { email: 'example@gmail.com', name: 'Example User', timestamp: new Date(), loginCount: 1, lastSession: new Date() },
      ],
      stats: {
        totalUsers: 1,
        dailyActiveUsers: 1,
        avgActiveUsers: 2,
      }
    });
  }
}

export default DashboardController;
