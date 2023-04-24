import { Request } from 'express';

export interface IUserSession {
  id: number;
  name?: string;
  email: string;
  emailVerified: boolean;
  from: string;
}

export default class SessionModel {
  static setUserSession(req: Request, account: IUserSession) {
    req.session.user = {
      id: account.id,
      email: account.email,
      name: account.name || '',
      emailVerified: account.emailVerified,
      from: account.from,
    };
  }
}