import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { TransactionsService } from '../services/transactions.service';

export class TransactionsController {
  static async getTransactions(req: Request, res: Response): Promise<Response<{ data: Transaction[] }>> {
    try {
      const transactions = await TransactionsService.getAll();
      return res.json({ data: transactions });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async getTransactionById(req: Request, res: Response): Promise<Response<{ data: Transaction }>> {
    try {
      const tag = await TransactionsService.getOneById(Number(req.params.id));
      return res.json({ data: tag });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async createTransaction(req: Request, res: Response): Promise<Response<{ data: Transaction }>> {
    try {
      const newTransaction = await TransactionsService.addOne(
        req.body.date,
        req.body.message,
        req.body.note_1,
        req.body.note_2,
        req.body.note_3,
        req.body.amount,
        req.body.source_id,
        req.body.tag_ids
      );
      return res.json({ data: newTransaction });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async updateTransaction(req: Request, res: Response): Promise<Response<{ data: Transaction }>> {
    try {
      const updatedTransaction = await TransactionsService.updateOne(
        Number(req.params.id),
        req.body.date,
        req.body.message,
        req.body.note_1,
        req.body.note_2,
        req.body.note_3,
        req.body.amount,
        req.body.source_id,
        req.body.tags
      );
      return res.json({ data: updatedTransaction });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async deleteTransaction(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await TransactionsService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }
}
