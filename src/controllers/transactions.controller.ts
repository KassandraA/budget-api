import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { TransactionsService } from '../services/transactions.service';
import { FilterSortPageDto } from '../dto/filter-sort-page.dto';
import { TransactionMetaDto } from '../dto/transaction-meta.dto';
import { FilterSortPageUtils } from '../utils/filter-sort-page.utils';
import { TransactionConverter } from '../utils/transaction-converter.utils';

export class TransactionsController {
  static async getAll(
    req: Request,
    res: Response
  ): Promise<Response<{ data: Transaction[]; meta: TransactionMetaDto }>> {
    try {
      const dto = FilterSortPageUtils.isFilterSortPageDto(req?.query)
        ? (req.query as FilterSortPageDto)
        : null;

      const transactions = await TransactionsService.getAll(dto);
      return res.json(transactions);
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async getOneById(
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

  static async addMany(
    req: Request,
    res: Response
  ): Promise<Response<{ data: Transaction[] }>> {
    try {
      const newTransactions = await TransactionsService.addMany(
        req.body.map((i: any) => TransactionConverter.toTransactionDto(i))
      );
      return res.json({ data: newTransactions });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async updateOne(
    req: Request,
    res: Response
  ): Promise<Response<{ data: Transaction }>> {
    try {
      const updatedTransaction = await TransactionsService.updateOne({
        transactionId: Number(req.params.id),
        ...TransactionConverter.toTransactionDto(req.body),
      });
      return res.json({ data: updatedTransaction });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async deleteOne(
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
