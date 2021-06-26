import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { TransactionsService } from '../services/transactions.service';
import { FilterSortPageDto } from '../dto/filter-sort-page.dto';
import { TransactionMetaDto } from '../dto/transaction-meta.dto';
import { TransactionDto } from '../dto/transaction.dto';
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
        req.body.map((i: any) => TransactionsController.setTransactionDto(i))
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
        ...TransactionsController.setTransactionDto(req.body),
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

  private static setTransactionDto(data: any): TransactionDto {
    return {
      message: data.message,
      note1: data.note_1,
      note2: data.note_2,
      note3: data.note_3,
      date: data.date,
      amount: data.amount,
      sourceId: data.source_id,
      tagIds: data.tag_ids,
    };
  }
}
