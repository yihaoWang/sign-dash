import { Prisma, accounts } from '@prisma/client'
import { Request } from 'express';

const _10_MINS_IN_MS = 10 * 60 * 1000;

export interface IUserSession {
  id: number;
  name?: string;
  email: string;
  emailVerified: boolean;
  from: string;
}

export default class SessionModel {
  static setUserSession(req: Request, account: accounts) {
    req.session.user = {
      id: account.id,
      email: account.email,
      name: account.name || '',
      emailVerified: account.email_verified || false,
      from: account.register_from,
    };

    req.session.lastSessionAt = Date.now();
  }

  static shouldUpdateSessionTime(req: Request) {
    if (!req.session.lastSessionAt) return true;

    return req.session.lastSessionAt < (Date.now() - _10_MINS_IN_MS)
  }

  static updateSessionTime(req: Request) {
    req.session.lastSessionAt = Date.now();
  }
}