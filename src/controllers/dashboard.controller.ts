import { Request, Response } from 'express';
import AccountModule from '../modules/account.module';

class DashboardController {
  async rednerProfilePage(req: Request, res: Response) {
    const uid = req.session.user?.id;

    if (!uid) {
      return res.redirect('/signin');
    }

    const account = await AccountModule.getAccountById(uid);

    if (!account) {
      return res.redirect('/signin');
    }

    res.render('dashboard-profile', {
      user: { email: account.email, name: account.name },
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
