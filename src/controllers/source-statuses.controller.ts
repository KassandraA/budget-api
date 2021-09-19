import { Request, Response } from 'express';
import { SourceStatusesService } from '../services/source-statuses.service';
import { SourceStatus } from '../models/source-status.model';

export class SourceStatusesController {
  static async getAll(req: Request, res: Response): Promise<Response<{ data: SourceStatus[] }>> {
    try {
      const sourceStatuses = await SourceStatusesService.getAll();
      return res.json({ data: sourceStatuses });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async getOneById(req: Request, res: Response): Promise<Response<{ data: SourceStatus }>> {
    try {
      const sourceStatus = await SourceStatusesService.getOneById(Number(req.params.id));
      return res.json({ data: sourceStatus });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async addOne(req: Request, res: Response): Promise<Response<{ data: SourceStatus }>> {
    try {
      const newSourceStatus = await SourceStatusesService.addOne(req.body.name, req.body.description);
      return res.json({ data: newSourceStatus });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async updateOne(req: Request, res: Response): Promise<Response<{ data: SourceStatus }>> {
    try {
      const updatedSourceStatus = await SourceStatusesService.updateOne(
        Number(req.params.id),
        req.body.name,
        req.body.description
      );
      return res.json({ data: updatedSourceStatus });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async deleteOne(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await SourceStatusesService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }
}
