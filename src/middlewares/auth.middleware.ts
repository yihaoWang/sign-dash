import { Request, Response, NextFunction } from 'express';
import { IUserSession } from '../modules/session.module';
import AccountModule from '../modules/account.module';

export function requireAuthentication(requireAccountActive = true) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.redirect('/');
    }

    if (requireAccountActive && !await isAccountActive(req.session.user)) {
      return res.redirect('/auth/active-account');
    }
    next();
  }
}

async function isAccountActive(userSession: IUserSession): Promise<boolean> {
  const { from, emailVerified, email } = userSession;

  if (from === 'email' && emailVerified === true) {
    return true;
  }

  const account = await AccountModule.getAccountByEmail(email);

  return Boolean(account && account.email_verified === true);
}