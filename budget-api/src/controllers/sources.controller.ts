import { Request, Response } from 'express';
import { SourcesService } from '../services/sources.service';
import { Source } from '../models/source.model';

export class SourcesController {
  static async getAll(req: Request, res: Response): Promise<Response<{ data: Source[] }>> {
    try {
      const sources = await SourcesService.getAll();
      return res.json({ data: sources });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async getOneById(req: Request, res: Response): Promise<Response<{ data: Source }>> {
    try {
      const source = await SourcesService.getOneById(Number(req.params.id));
      return res.json({ data: source });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async addOne(req: Request, res: Response): Promise<Response<{ data: Source }>> {
    try {
      const newSource = await SourcesService.addOne(
        req.body.name,
        req.body.description,
        req.body.currency,
        req.body.note_1,
        req.body.note_2,
        req.body.status_id
      );
      return res.json({ data: newSource });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async updateOne(req: Request, res: Response): Promise<Response<{ data: Source }>> {
    try {
      const updatedSource = await SourcesService.updateOne(
        Number(req.params.id),
        req.body.name,
        req.body.description,
        req.body.currency,
        req.body.note_1,
        req.body.note_2,
        req.body.status_id
      );
      return res.json({ data: updatedSource });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async deleteOne(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await SourcesService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }
}
