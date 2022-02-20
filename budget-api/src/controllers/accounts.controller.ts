import { Request, Response } from 'express';
import { AccountsService } from '../services/accounts.service';
import { Account } from '../models/account.model';

export class AccountsController {
  static async getAll(req: Request, res: Response): Promise<Response<{ data: Account[] }>> {
    try {
      const accounts = await AccountsService.getAll();
      return res.json({ data: accounts });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async getOneById(req: Request, res: Response): Promise<Response<{ data: Account }>> {
    try {
      const account = await AccountsService.getOneById(Number(req.params.id));
      return res.json({ data: account });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async addOne(req: Request, res: Response): Promise<Response<{ data: Account }>> {
    try {
      const newAccount = await AccountsService.addOne(
        req.body.name,
        req.body.description,
        req.body.currency,
        req.body.account_number,
        req.body.card_number,
        req.body.status_id
      );
      return res.json({ data: newAccount });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async updateOne(req: Request, res: Response): Promise<Response<{ data: Account }>> {
    try {
      const updatedAccount = await AccountsService.updateOne(
        Number(req.params.id),
        req.body.name,
        req.body.description,
        req.body.currency,
        req.body.account_number,
        req.body.card_number,
        req.body.status_id
      );
      return res.json({ data: updatedAccount });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async deleteOne(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await AccountsService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }
}
