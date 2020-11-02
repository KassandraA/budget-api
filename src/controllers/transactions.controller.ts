import { Request, Response } from 'express';
import { Transaction } from 'typeorm';

export class TransactionsController {
  static async getTransactions(req: Request, res: Response) {
    return req;
  }
}
