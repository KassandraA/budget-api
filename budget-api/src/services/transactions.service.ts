import { TransactionTypeormUtils } from '../utils/transaction-typeorm.utils';
import { TransactionFilterSortPageDto } from '../dto/transaction-filter-sort-page.dto';
import { NotFoundError } from '../errors/not-found.error';
import { Transaction } from '../models/transaction.model';
import { ValueNormalizer } from '../utils/value-normalizer.utils';
import { TagsService } from './tags.service';
import { ModelConstants } from '../models/model-constants';
import { TransactionDto } from '../../../budget-common/src/dto/transaction.dto';
import { TransactionConverter } from '../utils/transaction-converter.utils';
import { AccountsService } from './accounts.service';
import { Account } from '../models/account.model';
import { Tag } from '../models/tag.model';
import { Property } from '../models/property.model';
import { DatabaseConstants } from '../models/database-constants';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

export class TransactionsService {
  static async getMany(
    params?: TransactionFilterSortPageDto
  ): Promise<TransactionResponseDto> {
    const preFilled = TransactionTypeormUtils.preFill(params);
    const queryBuilder = TransactionTypeormUtils.getQueryBuilder(preFilled);
    const [result, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: result,
      meta: { ...preFilled, total_count: totalCount }
    };
  }

  static async getOneById(transactionId: number): Promise<Transaction> {
    const transaction = await Transaction.findOne({
      where: { id: transactionId },
      relations: [
        ModelConstants.transactionAccountProperty,
        ModelConstants.transactionTagsProperty,
        ModelConstants.transactionPropertiesProperty
      ]
    });

    if (!transaction) throw new NotFoundError('Transaction not found');
    return transaction;
  }

  static async addMany(transactions: TransactionDto[]): Promise<Transaction[]> {
    const tagsMap = await this.getTagsMap(transactions);
    const accountsMap = await this.getAccountsMap(transactions);

    const transactionArray = transactions.map((tran) => {
      const account = accountsMap.get(tran.accountName) as Account;
      const tags = tran.tagNames ? tran.tagNames.map((name) => tagsMap.get(name)) as Tag[] : [];
      const props = this.getProperties(tran);
      return TransactionConverter.fromDto(tran, account, tags, props);
    });

    return Transaction.save(transactionArray);
  }

  static async updateOne(transactionId: number, data: TransactionDto): Promise<Transaction> {
    const updatedTransaction = await Transaction.createQueryBuilder(DatabaseConstants.transactionsTable)
      .leftJoinAndSelect(
        `${DatabaseConstants.transactionsTable}.${ModelConstants.transactionPropertiesProperty}`,
        ModelConstants.transactionPropertiesProperty
      ).where({id: transactionId})
      .getOne();

    if (!updatedTransaction) throw new NotFoundError('Transaction not found');

    if (data.accountName !== undefined) {
      const transactionAccount = await AccountsService.getOneByName(data.accountName);
      if (transactionAccount) updatedTransaction.account_id = transactionAccount.id;
    }

    if (data.date !== undefined)
      updatedTransaction.date = data.date;
    if (data.message !== undefined)
      updatedTransaction.message = ValueNormalizer.normalizeString(data.message);
    if (data.transactor !== undefined)
      updatedTransaction.transactor = ValueNormalizer.normalizeString(data.transactor);
    if (data.amount !== undefined)
      updatedTransaction.amount = data.amount;
    if (data.tagNames !== undefined)
      updatedTransaction.tags = data.tagNames.length > 0 ? await TagsService.addMany(data.tagNames) : [];
    if (data.properties !== undefined)
      updatedTransaction.properties = this.getUpdatedProperties(updatedTransaction.properties, data.properties);

    return await Transaction.save(updatedTransaction);
  }

  static async deleteOne(transactionId: number): Promise<void> {
    const result = await Transaction.delete(transactionId);
    if (result.affected && result.affected < 1) {
      throw new NotFoundError('Transaction not found');
    }
  }

  private static async getTagsMap(transactions: TransactionDto[]): Promise<Map<string, Tag>> {
    const tagNames = transactions.reduce((tn: string[], tran: TransactionDto) => {
      return tran?.tagNames?.length > 0 ? [...tn, ...tran.tagNames] : [...tn];
    }, []);
    const transactionTags = await TagsService.addMany(tagNames);
    return new Map(transactionTags.map((tag) => [tag.name, tag]));
  }

  private static async getAccountsMap(transactions: TransactionDto[]): Promise<Map<string, Account>> {
    const accountNames = [...new Set(transactions.map((tran) => tran?.accountName))];
    const transactionAccounts = await AccountsService.getManyByNames(accountNames);
    const accountsMap = new Map(transactionAccounts.map((account) => [account.name, account]));

    if (accountNames.length > transactionAccounts.length) {
      const missing = accountNames.filter(name => !accountsMap.has(name));
      throw new NotFoundError(`The following accounts were not found: '${missing.join("', '")}'`);
    } else {
      return accountsMap;
    }
  }

  private static getProperties(transaction: TransactionDto): Property[] {
   return !transaction.properties || !transaction.properties.size
      ? []
      : Array.from(transaction.properties, ([propName, propValue]) => {
          const prop = new Property();
          prop.name = propName;
          prop.value = propValue;
          return prop;
        });
  }

  private static getUpdatedProperties(existingProps: Property[], newProps: Map<string, string>): Property[] {
    if (!newProps.size) {
      return [];
    }
    const newPrs = new Map(newProps);
    const existingPrs = existingProps?.length
      ? existingProps.filter((ep) => {
          const newVal = newProps.get(ep.name);
          if (newVal) {
            if (ep.value !== newVal) {
              ep.value = newVal;
            }
            newPrs.delete(ep.name);
            return true;
          }

          return false;
        })
      : [];

    const addedPrs = newPrs.size
      ? Array.from(newPrs, ([propName, propValue]) => {
          const prop = new Property();
          prop.name = propName;
          prop.value = propValue;
          return prop;
        })
      : [];

    return [...existingPrs, ...addedPrs];
  }
}
