import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { TransactionsService } from '../services/transactions.service';
import { FilterSortPageDto } from '../dto/filter-sort-page.dto';
import { TransactionMetaDto } from '../dto/transaction-meta.dto';
import { FilterSortPageUtils } from '../utils/filter-sort-page.utils';

export class TransactionsController {
  static async getTransactions(
    req: Request,
    res: Response
  ): Promise<Response<{ data: Transaction[]; meta: TransactionMetaDto }>> {
    try {
      const dto = FilterSortPageUtils.isFilterSortPageDto(req?.query)
        ? (req.query as FilterSortPageDto)
        : null;

      const transactions = await TransactionsService.get(dto);
      return res.json(transactions);
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async getTransactionById(
    req: Request,
    res: Response
  ): Promise<Response<{ data: Transaction }>> {
    try {
      const tag = await TransactionsService.getOneById(Number(req.params.id));
      return res.json({ data: tag });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async createMultiTransaction(
    req: Request,
    res: Response
  ): Promise<Response<{ data: Transaction[] }>> {
    try {
      const newTransactions = await TransactionsService.addMany(
        // TODO req.body as INewTransactionInterface
        req.body.map((i: any) => ({
          message: i.message,
          note1: i.note_1,
          note2: i.note_2,
          note3: i.note_3,
          date: i.date,
          amount: i.amount,
          sourceId: i.source_id,
          tagIds: i.tag_ids,
        }))
      );
      return res.json({ data: newTransactions });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async updateTransaction(
    req: Request,
    res: Response
  ): Promise<Response<{ data: Transaction }>> {
    try {
      const updatedTransaction = await TransactionsService.updateOne({
        transactionId: Number(req.params.id),
        date: req.body.date,
        message: req.body.message,
        note1: req.body.note_1,
        note2: req.body.note_2,
        note3: req.body.note_3,
        amount: req.body.amount,
        sourceId: req.body.source_id,
        tagIds: req.body.tag_ids,
      });
      return res.json({ data: updatedTransaction });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async deleteTransaction(
    req: Request,
    res: Response
  ): Promise<Response<{ message: string }>> {
    try {
      await TransactionsService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }
}
