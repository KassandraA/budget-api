import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { TransactionsService } from '../services/transactions.service';
import { TransactionFilterSortPageDto } from '../dto/transaction-filter-sort-page.dto';
import { TransactionResponse } from '../dto/transaction-meta.dto';
import { TransactionTypeormUtils } from '../utils/transaction-typeorm.utils';
import { TransactionConverter } from '../utils/transaction-converter.utils';

export class TransactionsController {
  static async getMany(
    req: Request,
    res: Response
  ): Promise<Response<TransactionResponse>> {
    try {
      const dto = TransactionTypeormUtils.isFilterSortPageDto(req?.query)
        ? (req.query as TransactionFilterSortPageDto)
        : null;

      const transactions = await TransactionsService.getMany(dto);
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
        req.body.map((i: any) => TransactionConverter.asDto(i))
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
      const updatedTransaction = await TransactionsService.updateOne(
        Number(req.params.id),
        TransactionConverter.asDto(req.body)
      );
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
