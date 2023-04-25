import { Prisma, PrismaClient } from '@prisma/client'
import randomstring from 'randomstring';

const prisma = new PrismaClient();

export default class AccountModule {
  static isValidPassword(password: string): Boolean {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+[\]{};':"\\|,.<>\/?]).{8,}$/;

    return regex.test(password);
  }

  static async createAccount(accountInfo: Prisma.accountsCreateInput) {
    return prisma.accounts.create({
      data: accountInfo,
    });
  }

  static async getAccountById(uid: number) {
    return await prisma.accounts.findUnique({
      where: { id: uid },
    });
  }

  static async getAccountByEmail(email: string) {
    return prisma.accounts.findUnique({
      where: { email },
    });
  }

  static async updateAccountById(uid: number, data: Prisma.accountsUpdateInput) {
    return prisma.accounts.update({
      where: { id: uid },
      data: data,
    });
  }

  static async getAllAccounts(select: Prisma.accountsSelect) {
    return prisma.accounts.findMany({ select });
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