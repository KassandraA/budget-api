import { TransactionTypeormUtils } from '../utils/transaction-typeorm.utils';
import { TransactionFilterSortPageDto } from '../dto/transaction-filter-sort-page.dto';
import { NotFoundError } from '../errors/not-found.error';
import { Transaction } from '../models/transaction.model';
import { ValueNormalizer } from '../utils/value-normalizer.utils';
import { TagsService } from './tags.service';
import { TransactionResponseDto } from 'src/dto/transaction-response.dto';
import { ModelConstants } from '../models/model-constants';
import { TransactionDto } from '../../../budget-common/src/dto/transaction.dto';
import { TransactionConverter } from '../utils/transaction-converter.utils';
import { AccountsService } from './accounts.service';
import { Account } from '../models/account.model';

export class TransactionsService {
  static async getMany(
    params?: TransactionFilterSortPageDto
  ): Promise<TransactionResponseDto> {
    const preFilled = TransactionTypeormUtils.preFill(params);
    const searchOptions = TransactionTypeormUtils.findMany(preFilled);
    const [result, totalCount] = await Transaction.findAndCount(searchOptions);

    return {
      data: result,
      meta: { ...preFilled, total_count: totalCount },
    };
  }

  static async getOneById(transactionId: number): Promise<Transaction> {
    const transaction = await Transaction.findOne(
      { id: transactionId },
      { relations: [ModelConstants.tagsTable] }
    );

    if (!transaction) throw new NotFoundError('Transaction not found');
    return transaction;
  }

  static async addMany(transactions: TransactionDto[]): Promise<Transaction[]> {
    const tagNames = transactions.reduce((tn, tran) => {
      return tran?.tagNames?.length > 0 ? [...tn, ...tran.tagNames] : [...tn];
    }, []);
    const transactionTags = await TagsService.addMany(tagNames);
    const tagsMap = new Map(transactionTags.map((tag) => [tag.name, tag]));

    const accountNames = [...new Set(transactions.map((tran) => tran?.accountName))];
    const transactionAccounts = await AccountsService.getManyByNames(accountNames);
    const accountsMap = new Map(transactionAccounts.map((account) => [account.name, account]));

    if (accountNames.length > transactionAccounts.length) {
      const missing = accountNames.filter(name => !accountsMap.has(name));
      throw new NotFoundError(`The following accounts were not found: '${missing.join("', '")}'`);
    }

    const transactionArray = transactions.map((tran) => {
      const account = accountsMap.get(tran.accountName) as Account;
      const tags = tran.tagNames.map((name) => tagsMap.get(name));
      return TransactionConverter.fromDto(tran, account, tags)
    });

    return this.saveMultipleTransactions(transactionArray);
  }

  static async updateOne(transactionId: number, data: TransactionDto): Promise<Transaction> {
    const updatedTransaction = await Transaction.findOne({ id: transactionId });

    if (!updatedTransaction) throw new NotFoundError('Transaction not found');

    if (data.accountName !== undefined) {
      const transactionAccount = await AccountsService.getOneByName(data.accountName);
      if (transactionAccount) updatedTransaction.account_id = transactionAccount.id;
    }

    if (data.date !== undefined)
      updatedTransaction.date = data.date;
    if (data.message !== undefined)
      updatedTransaction.message = ValueNormalizer.normalizeString(data.message);
    if (data.note1 !== undefined)
      updatedTransaction.note_1 = ValueNormalizer.normalizeString(data.note1);
    if (data.note2 !== undefined)
      updatedTransaction.note_2 = ValueNormalizer.normalizeString(data.note2);
    if (data.note3 !== undefined)
      updatedTransaction.note_3 = ValueNormalizer.normalizeString(data.note3);
    if (data.amount !== undefined)
      updatedTransaction.amount = data.amount;
    if (data.tagNames !== undefined) {
      updatedTransaction.tags =
        data.tagNames.length > 0 ? await TagsService.addMany(data.tagNames) : [];
    }

    return (await this.saveMultipleTransactions([updatedTransaction]))[0];
  }

  static async deleteOne(transactionId: number) {
    const deletedAccount = await Transaction.findOne({ id: transactionId });
    if (!deletedAccount) throw new NotFoundError('Transaction not found');

    await deletedAccount.remove();
  }

  private static async saveMultipleTransactions(
    multiTransactions: Transaction[]
  ): Promise<Transaction[]> {
    return this.catchErrorOnSave(() => Transaction.save(multiTransactions));
  }

  private static async catchErrorOnSave<T>(callback: () => Promise<T>): Promise<T> {
    try {
      return await callback();
    } catch (error) {
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        throw new NotFoundError(`account_id not found`);
      } else {
        throw error;
      }
    }
  }
}
