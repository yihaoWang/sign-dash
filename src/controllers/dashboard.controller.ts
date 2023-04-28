import { NextFunction, Request, Response } from 'express';
import AccountModule from '../modules/account.module';

class DashboardController {
  getTimeOfLastXDay(xDay: number): Date {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(new Date().getDate() - xDay);

    return date;
  }

  /**
   * @openapi
   * /dashboard/profile:
   *   get:
   *     description: profile page
   *     responses:
   *       200:
   *         description: render profile page, rediect to landing page if user is not logged in
   *       500:
   *         description: Internal server error.
   */
  async rednerProfilePage(req: Request, res: Response, next: NextFunction) {
    try {
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
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /dashboard/statistics:
   *   get:
   *     description: statistics page
   *     responses:
   *       200:
   *         description: render statistics page, rediect to landing page if user is not logged in
   *       500:
   *         description: Internal server error.
   */
  async rednerStatisticsPage(req: Request, res: Response, next: NextFunction) {
    try {
      const allAccounts = await AccountModule.getAllAccounts({
        'email': true,
        'created_at': true,
        'login_count': true,
        'last_session_at': true,
      });
      const numUsers = allAccounts.length;
      const today = this.getTimeOfLastXDay(0);
      const dateOfLast7Day = this.getTimeOfLastXDay(7);
      const numDailyActiveUsers = allAccounts.filter(({ last_session_at }) => (
        last_session_at && last_session_at.getTime() > today.getTime()
      )).length;
      const numWeeklyActiveUsers = allAccounts.filter(({ last_session_at }) => (
        last_session_at && last_session_at.getTime() >= dateOfLast7Day.getTime()
      )).length;

      res.render('dashboard-statistics', {
        users: allAccounts,
        stats: {
          totalUsers: numUsers,
          dailyActiveUsers: numDailyActiveUsers,
          avgActiveUsers: numWeeklyActiveUsers,
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

export default DashboardController;
