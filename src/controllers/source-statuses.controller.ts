import { Request, Response } from 'express';
import { SourceStatusesService } from '../services/source-statuses.service';
import { SourceStatus } from '../models/source-status.model';

export class SourceStatusesController {
  static async getSourceStatuses(req: Request, res: Response): Promise<Response<{ data: SourceStatus[] }>> {
    try {
      const source_statuses = await SourceStatusesService.getAll();
      return res.json({ data: source_statuses });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async getSourceStatusById(req: Request, res: Response): Promise<Response<{ data: SourceStatus }>> {
    try {
      const source_status = await SourceStatusesService.getOneById(Number(req.params.id));
      return res.json({ data: source_status });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async createSourceStatus(req: Request, res: Response): Promise<Response<{ data: SourceStatus }>> {
    try {
      const new_source_status = await SourceStatusesService.addOne(req.body.name, req.body.description);
      return res.json({ data: new_source_status });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async updateSourceStatus(req: Request, res: Response): Promise<Response<{ data: SourceStatus }>> {
    try {
      const updated_source_status = await SourceStatusesService.updateOne(
        Number(req.params.id),
        req.body.name,
        req.body.description
      );
      return res.json({ data: updated_source_status });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async deleteSourceStatus(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await SourceStatusesService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }
}
