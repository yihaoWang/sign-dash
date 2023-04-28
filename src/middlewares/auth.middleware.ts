import { Request, Response, NextFunction } from 'express';
import SessionModel, { IUserSession } from '../modules/session.module';
import AccountModule from '../modules/account.module';

export function requireAuthentication(requireAccountActive = true) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.redirect('/');
    }

    const uid = req.session.user.id;
    const account = await AccountModule.getAccountById(uid);

    if (!account) {
      req.session.user = undefined;
      return res.redirect('/');
    }

    if (SessionModel.shouldUpdateSessionTime(req)) {
      SessionModel.updateSessionTime(req);
      AccountModule.updateAccountById(uid, { last_session_at: new Date() });  // don't wait
    }

    if (requireAccountActive && !await isAccountActive(req.session.user)) {
      return res.redirect('/auth/active-account');
    }
    next();
  }
}

async function isAccountActive(userSession: IUserSession): Promise<boolean> {
  const { from, emailVerified, id } = userSession;

  if (from !== 'email' || emailVerified === true) {
    return true;
  }

  const account = await AccountModule.getAccountById(id);

  return Boolean(account && account.email_verified === true);
}