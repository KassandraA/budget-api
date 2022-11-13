import { In } from 'typeorm';
import { NotUniqueError } from '../errors/not-unique.error';
import { NotFoundError } from '../errors/not-found.error';
import { Account } from '../models/account.model';
import { ValueNormalizer } from '../utils/value-normalizer.utils';

export class AccountsService {
  static async getAll(): Promise<Account[]> {
    return await Account.find();
  }

  static async getOneById(accountId: number): Promise<Account> {
    const account = await Account.findOneBy({ id: accountId });
    if (!account) throw new NotFoundError('Account not found');
    return account;
  }

  static async getOneByName(accountName: string): Promise<Account> {
    const account = await Account.findOneBy({ name: accountName });
    if (!account) throw new NotFoundError(`Account '${accountName}' not found`);
    return account;
  }

  static async getManyByNames(accountNames: string[]): Promise<Account[]> {
    if (!accountNames || accountNames.length === 0) return [];
    return await Account.findBy({ name: In([...new Set(accountNames)]) });
  }

  static async addOne(
    name: string,
    description: string,
    currency: string,
    accountNumber: string,
    cardNumber: string,
    statusId: number
  ): Promise<Account> {
    const newAccount = new Account();
    newAccount.name = ValueNormalizer.normalizeString(name);
    newAccount.description = ValueNormalizer.normalizeString(description);
    newAccount.currency = ValueNormalizer.normalizeString(currency);
    newAccount.account_number = ValueNormalizer.normalizeString(accountNumber);
    newAccount.card_number = ValueNormalizer.normalizeString(cardNumber);
    newAccount.status_id = statusId;

    return this.saveAccount(newAccount);
  }

  static async updateOne(
    accountId: number,
    name: string,
    description: string,
    currency: string,
    accountNumber: string,
    cardNumber: string,
    statusId: number
  ): Promise<Account> {
    const updatedAccount = await Account.findOneBy({
      id: accountId
    });

    if (!updatedAccount) throw new NotFoundError('Account not found');

    if (name !== undefined) updatedAccount.name = ValueNormalizer.normalizeString(name);
    if (description !== undefined)
      updatedAccount.description = ValueNormalizer.normalizeString(description);
    if (currency !== undefined) updatedAccount.currency = ValueNormalizer.normalizeString(currency);
    if (accountNumber !== undefined) updatedAccount.account_number = ValueNormalizer.normalizeString(accountNumber);
    if (cardNumber !== undefined) updatedAccount.card_number = ValueNormalizer.normalizeString(cardNumber);
    if (statusId !== undefined) updatedAccount.status_id = statusId;

    return this.saveAccount(updatedAccount);
  }

  static async deleteOne(accountId: number) {
    const result = await Account.delete(accountId);
    if (result.affected && result.affected < 1) {
      throw new NotFoundError('Account not found');
    }
  }

  private static async saveAccount(account: Account): Promise<Account> {
    try {
      return await account.save();
    } catch (error) {
      if ((error as Error).message.includes('FOREIGN KEY constraint failed')) {
        throw new NotFoundError(`status_id not found: ${account.status_id}`);
      } else if ((error as Error).message.includes('UNIQUE constraint failed: accounts.name')) {
        throw new NotUniqueError(`The name '${account.name}' is already in use`);
      } else {
        throw error;
      }
    }
  }
}
