import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

interface IAccount {
  email: string;
  name?: string;
  password?: string;
  googleId?: number;
  facebookId?: number;
  emailVerified?: boolean;
}

export default class AccountModule {
  static async create(accountInfo: IAccount) {
    await prisma.accounts.create({
      data: accountInfo,
    });
  }

  static async getByEmail(email: string) {
    return await prisma.accounts.findUnique({
      where: { email },
    });
  }
}