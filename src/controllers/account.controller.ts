import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import AccountModule from '../modules/account.module';

class AccountController {
  /**
   * @openapi
   * /account/name:
   *   post:
   *     description: Update user name.
   *     parameters:
   *       - name: username
   *         description: New user name.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Updated successfully.
   *       400:
   *         description: Bad parameters.
   *       500:
   *         description: Internal server error.
   */
  async updteName(req: Request, res: Response, next: NextFunction) {
    try {
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
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /account/name:
   *   post:
   *     description: Update user name.
   *     parameters:
   *       - name: oldPassword
   *         description: Old user password.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: newPassword1
   *         description: New user password.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: newPassword2
   *         description: Confirmed new user password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Updated successfully.
   *       400:
   *         description: Bad parameters.
   */
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.session.user?.id;
      const from = req.session.user?.from;
      const oldPassword: string = req.body.oldPassword;
      const password1: string = req.body.newPassword1;
      const password2: string = req.body.newPassword2;

      if (!uid) {
        return res.status(400).json({ message: 'Missing account, please re-login' });
      }

      if (from !== 'email') {
        return res.status(400).json({ message: 'User from social login don\'t need password' });
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
    } catch (err) {
      next(err);
    }
  }
}

export default AccountController;
