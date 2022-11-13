import { Request, Response } from 'express';
import { AccountsService } from '../services/accounts.service';
import { Account } from '../models/account.model';
import { StatusCodeError } from '../errors/status-code.error';
import { KeyValueType } from '../dto/transaction-filter-sort-page.dto';

export class AccountsController {
  static async getAll(req: Request, res: Response): Promise<Response<{ data: Account[] }>> {
    try {
      const accounts = await AccountsService.getAll();
      return res.json({ data: accounts });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async getOneById(req: Request, res: Response): Promise<Response<{ data: Account }>> {
    try {
      const account = await AccountsService.getOneById(Number(req.params.id));
      return res.json({ data: account });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async addOne(req: Request, res: Response): Promise<Response<{ data: Account }>> {
    try {
      const newAccount = await AccountsService.addOne(
        (req.body as KeyValueType).name as string,
        (req.body as KeyValueType).description as string,
        (req.body as KeyValueType).currency as string,
        (req.body as KeyValueType).account_number as string,
        (req.body as KeyValueType).card_number as string,
        (req.body as KeyValueType).status_id as number
      );
      return res.json({ data: newAccount });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async updateOne(req: Request, res: Response): Promise<Response<{ data: Account }>> {
    try {
      const updatedAccount = await AccountsService.updateOne(
        Number(req.params.id),
        (req.body as KeyValueType).name as string,
        (req.body as KeyValueType).description as string,
        (req.body as KeyValueType).currency as string,
        (req.body as KeyValueType).account_number as string,
        (req.body as KeyValueType).card_number as string,
        (req.body as KeyValueType).status_id as number
      );
      return res.json({ data: updatedAccount });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async deleteOne(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await AccountsService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }
}
