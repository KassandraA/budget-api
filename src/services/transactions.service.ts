import { FilterSortPageUtils } from '../utils/filter-sort-page.utils';
import { FilterSortPageDto } from '../dto/filter-sort-page.dto';
import { NotFoundError } from '../errors/not-found.error';
import { Transaction } from '../models/transaction.model';
import { ValueNormalizer } from '../utils/value-normalizer.utils';
import { TagsService } from './tags.service';
import { TransactionMetaDto } from '../dto/transaction-meta.dto';
import { ModelConstants } from '../models/model-constants';

export class TransactionsService {
  static async get(
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

  static async addOne(
    date: Date,
    message: string,
    note1: string,
    note2: string,
    note3: string,
    amount: number,
    sourceId: number,
    tagIds: number[]
  ): Promise<Transaction> {
    const tags = await TagsService.getManyById(tagIds);

    const newTransaction = new Transaction();

    newTransaction.date = date;
    newTransaction.message = ValueNormalizer.normalizeString(message);
    newTransaction.note_1 = ValueNormalizer.normalizeString(note1);
    newTransaction.note_2 = ValueNormalizer.normalizeString(note2);
    newTransaction.note_3 = ValueNormalizer.normalizeString(note3);
    newTransaction.amount = amount;
    newTransaction.source_id = sourceId;
    newTransaction.tags = tags;

    return this.saveTransaction(newTransaction);
  }

  static async updateOne(
    transactionId: number,
    date: Date,
    message: string,
    note1: string,
    note2: string,
    note3: string,
    amount: number,
    sourceId: number,
    tagIds: number[]
  ): Promise<Transaction> {
    const updatedTransaction = await Transaction.findOne({
      id: transactionId,
    });

    if (!updatedTransaction) throw new NotFoundError('Transaction not found');

    if (date !== undefined) updatedTransaction.date = date;
    if (message !== undefined)
      updatedTransaction.message = ValueNormalizer.normalizeString(message);
    if (note1 !== undefined) updatedTransaction.note_1 = ValueNormalizer.normalizeString(note1);
    if (note2 !== undefined) updatedTransaction.note_2 = ValueNormalizer.normalizeString(note2);
    if (note3 !== undefined) updatedTransaction.note_3 = ValueNormalizer.normalizeString(note3);
    if (amount !== undefined) updatedTransaction.amount = amount;
    if (sourceId !== undefined) updatedTransaction.source_id = sourceId;
    if (tagIds !== undefined) {
      updatedTransaction.tags = tagIds.length > 0 ? await TagsService.getManyById(tagIds) : [];
    }

    return this.saveTransaction(updatedTransaction);
  }

  static async deleteOne(transactionId: number) {
    const deletedSource = await Transaction.findOne({ id: transactionId });
    if (!deletedSource) throw new NotFoundError('Transaction not found');

    await deletedSource.remove();
  }

  private static async saveTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      return await transaction.save();
    } catch (error) {
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        throw new NotFoundError(`source_id not found`);
      } else {
        throw error;
      }
    }
  }
}
