import { Request, Response } from 'express';
import { AccountStatusesService } from '../services/account-statuses.service';
import { AccountStatus } from '../models/account-status.model';

export class AccountStatusesController {
  static async getAll(req: Request, res: Response): Promise<Response<{ data: AccountStatus[] }>> {
    try {
      const accountStatuses = await AccountStatusesService.getAll();
      return res.json({ data: accountStatuses });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async getOneById(req: Request, res: Response): Promise<Response<{ data: AccountStatus }>> {
    try {
      const accountStatus = await AccountStatusesService.getOneById(Number(req.params.id));
      return res.json({ data: accountStatus });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async addOne(req: Request, res: Response): Promise<Response<{ data: AccountStatus }>> {
    try {
      const newAccountStatus = await AccountStatusesService.addOne(req.body.name, req.body.description);
      return res.json({ data: newAccountStatus });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async updateOne(req: Request, res: Response): Promise<Response<{ data: AccountStatus }>> {
    try {
      const updatedAccountStatus = await AccountStatusesService.updateOne(
        Number(req.params.id),
        req.body.name,
        req.body.description
      );
      return res.json({ data: updatedAccountStatus });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async deleteOne(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await AccountStatusesService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }
}
