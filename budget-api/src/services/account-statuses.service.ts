import { NotUniqueError } from '../errors/not-unique.error';
import { NotFoundError } from '../errors/not-found.error';
import { RemovalRestrictedError } from '../errors/removal-restricted.error';
import { AccountStatus } from '../models/account-status.model';
import { ValueNormalizer } from '../utils/value-normalizer.utils';
import { DatabaseConstants } from '../models/database-constants';

export class AccountStatusesService {
  static async getAll(): Promise<AccountStatus[]> {
    return await AccountStatus.find();
  }

  static async getOneById(accountStatusId: number): Promise<AccountStatus> {
    const accountStatus = await AccountStatus.findOneBy({ id: accountStatusId });

    if (!accountStatus) throw new NotFoundError('Account status not found');
    return accountStatus;
  }

  static async addOne(name: string, description?: string): Promise<AccountStatus> {
    const newAccountStatus = new AccountStatus();
    newAccountStatus.name = name;
    if (description !== undefined) newAccountStatus.description = description || null;

    return this.saveAccountStatus(newAccountStatus);
  }

  static async updateOne(
    accountStatusId: number,
    name?: string,
    description?: string
  ): Promise<AccountStatus> {
    const updatedAccountStatus = await AccountStatus.findOneBy({ id: accountStatusId });
    if (!updatedAccountStatus) throw new NotFoundError('Account status not found');
    if (name !== undefined) updatedAccountStatus.name = ValueNormalizer.normalizeString(name) as string;
    if (description !== undefined) updatedAccountStatus.description = ValueNormalizer.normalizeString(description);

    return this.saveAccountStatus(updatedAccountStatus);
  }

  static async deleteOne(accountStatusId: number): Promise<string> {
    try {
      const result = await AccountStatus.delete(accountStatusId);
      if (result.affected === 1) {
        return 'Deleted successfully';
      } else {
        throw new NotFoundError('Account status not found');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('FOREIGN KEY constraint failed')) {
        throw new RemovalRestrictedError(
          `The account status with id ${accountStatusId} can not be deleted, it is used by at least one account`
        );
      } else {
        throw error;
      }
    }
  }

  private static async saveAccountStatus(accountStatus: AccountStatus): Promise<AccountStatus> {
    try {
      return await accountStatus.save();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes(`UNIQUE constraint failed: ${DatabaseConstants.accountStatusesTable}.name`)) {
        throw new NotUniqueError(`The name '${accountStatus.name}' is already in use`);
      } else {
        throw error;
      }
    }
  }
}
