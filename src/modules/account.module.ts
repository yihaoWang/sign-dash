import { PrismaClient } from '@prisma/client'
import randomstring from 'randomstring';

const prisma = new PrismaClient();

interface IAccount {
  name?: string;
  google_id?: string;
  facebook_id?: string;
  email: string;
  password?: string;
  email_verified?: boolean;
  register_from: string;
}

interface IAccountUpdateFields {
  name?: string;
  password?: string;
}

export default class AccountModule {
  static isValidPassword(password: string): Boolean {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+[\]{};':"\\|,.<>\/?]).{8,}$/;

    return regex.test(password);
  }

  static async createAccount(accountInfo: IAccount) {
    return await prisma.accounts.create({
      data: accountInfo,
    });
  }

  static async getAccountById(uid: number) {
    return await prisma.accounts.findUnique({
      where: { id: uid },
    });
  }

  static async getAccountByEmail(email: string) {
    return await prisma.accounts.findUnique({
      where: { email },
    });
  }

  static async updateAccountById(uid: number, data: IAccountUpdateFields) {
    return await prisma.accounts.update({
      where: { id: uid },
      data: data,
    });
  }

  static async createVerificationCode(email: string) {
    const verificationCode = randomstring.generate(6);

    await prisma.emailverificationcodes.create({
      data: {
        email,
        code: verificationCode,
      }
    })

    return verificationCode;
  }

  static async verifyVerificationCode(verificationCode: string) {
    const code = await prisma.emailverificationcodes.findUnique({
      where: { code: verificationCode },
    });

    if (!code) {
      throw new Error('Invalid verification code');
    }

    await prisma.accounts.update({
      where: { email: code.email },
      data: {
        email_verified: true,
      }
    });
  }
}