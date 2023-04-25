import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import AccountModule from '../modules/account.module';

class AccountController {
  async updteName(req: Request, res: Response) {
    const uid = req.session.user?.id;
    const { username } = req.body;

    if (!uid) {
      return res.status(400).json({ message: 'Missing account, please re-login' });
    }

    if (!username) {
      return res.status(400).json({ message: 'Invalid name' });
    }

    await AccountModule.updateAccountById(uid, { name: username });
    return res.sendStatus(200);
  }

  async updatePassword(req: Request, res: Response) {
    const uid = req.session.user?.id;
    const oldPassword: string = req.body.oldPassword;
    const password1: string = req.body.newPassword1;
    const password2: string = req.body.newPassword2;

    if (!uid) {
      return res.status(400).json({ message: 'Missing account, please re-login' });
    }

    if (password1 !== password2) {
      return res.status(400).json({ message: 'Please check new passwords are the same' });
    }

    if (!AccountModule.isValidPassword(password1)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.' });
    }

    const account = await AccountModule.getAccountById(uid);

    if (!account) {
      return res.status(400).json({ message: 'Missing account, please re-login' });
    }

    if (account.password && !bcrypt.compareSync(oldPassword, account.password)) {
      return res.status(400).json({ message: 'Please check your old password is correct' });
    }

    await AccountModule.updateAccountById(uid, { password: bcrypt.hashSync(password1, 10) });
    return res.sendStatus(200);
  }
}

export default AccountController;
