import { Request, Response } from 'express';
import { AccountStatusesService } from '../services/account-statuses.service';
import { AccountStatus } from '../models/account-status.model';
import { StatusCodeError } from '../errors/status-code.error';
import { KeyValueType } from '../dto/transaction-filter-sort-page.dto';

export class AccountStatusesController {
  static async getAll(_req: Request, res: Response): Promise<Response<{ data: AccountStatus[] }>> {
    try {
      const accountStatuses = await AccountStatusesService.getAll();
      return res.json({ data: accountStatuses });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async getOneById(req: Request, res: Response): Promise<Response<{ data: AccountStatus }>> {
    try {
      const accountStatus = await AccountStatusesService.getOneById(Number(req.params.id));
      return res.json({ data: accountStatus });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async addOne(req: Request, res: Response): Promise<Response<{ data: AccountStatus }>> {
    try {
      const newAccountStatus = await AccountStatusesService.addOne(
        (req.body as KeyValueType).name as string,
        (req.body as KeyValueType).description as string
      );
      return res.json({ data: newAccountStatus });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async updateOne(req: Request, res: Response): Promise<Response<{ data: AccountStatus }>> {
    try {
      const updatedAccountStatus = await AccountStatusesService.updateOne(
        Number(req.params.id),
        (req.body as KeyValueType).name as string,
        (req.body as KeyValueType).description as string
      );
      return res.json({ data: updatedAccountStatus });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async deleteOne(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await AccountStatusesService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }
}
