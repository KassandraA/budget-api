import { FilterSortPageUtils } from '../utils/filter-sort-page.utils';
import { FilterSortPageDto } from '../dto/filter-sort-page.dto';
import { NotFoundError } from '../errors/not-found.error';
import { Transaction } from '../models/transaction.model';
import { ValueNormalizer } from '../utils/value-normalizer.utils';
import { TagsService } from './tags.service';
import { TransactionMetaDto } from '../dto/transaction-meta.dto';
import { ModelConstants } from '../models/model-constants';
import { TransactionDto } from '../dto/transaction.dto';
import { TransactionConverter } from '../utils/transaction-converter.utils';

export class TransactionsService {
  static async getMany(
    params?: FilterSortPageDto
  ): Promise<{ data: Transaction[]; meta: TransactionMetaDto }> {
    const preFilled = FilterSortPageUtils.preFill(params);
    const searchOptions = FilterSortPageUtils.mapDtoToTypeorm(preFilled);
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
    const allTagIs = transactions.reduce((ts, tran) => {
      return tran?.tagIds?.length > 0 ? [...ts, ...tran.tagIds] : [];
    }, []);

    const allTags = await TagsService.getManyById([...new Set(allTagIs)]);

    const transactionArray = transactions.map((tran) =>
      TransactionConverter.fromDto(
        tran,
        allTags.filter((tag) => tran.tagIds.includes(tag.id))
      )
    );

    return this.saveMultipleTransactions(transactionArray);
  }

  static async updateOne(data: TransactionDto): Promise<Transaction> {
    const updatedTransaction = await Transaction.findOne({
      id: data.transactionId,
    });

    if (!updatedTransaction) throw new NotFoundError('Transaction not found');

    if (data.date !== undefined) updatedTransaction.date = data.date;
    if (data.message !== undefined)
      updatedTransaction.message = ValueNormalizer.normalizeString(data.message);
    if (data.note1 !== undefined)
      updatedTransaction.note_1 = ValueNormalizer.normalizeString(data.note1);
    if (data.note2 !== undefined)
      updatedTransaction.note_2 = ValueNormalizer.normalizeString(data.note2);
    if (data.note3 !== undefined)
      updatedTransaction.note_3 = ValueNormalizer.normalizeString(data.note3);
    if (data.amount !== undefined) updatedTransaction.amount = data.amount;
    if (data.sourceId !== undefined) updatedTransaction.source_id = data.sourceId;
    if (data.tagIds !== undefined) {
      updatedTransaction.tags =
        data.tagIds.length > 0 ? await TagsService.getManyById(data.tagIds) : [];
    }

    return (await this.saveMultipleTransactions([updatedTransaction]))[0];
  }

  static async deleteOne(transactionId: number) {
    const deletedSource = await Transaction.findOne({ id: transactionId });
    if (!deletedSource) throw new NotFoundError('Transaction not found');

    await deletedSource.remove();
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
        throw new NotFoundError(`source_id not found`);
      } else {
        throw error;
      }
    }
  }
}