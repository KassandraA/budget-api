import { Request, Response } from 'express';
import { TagsService } from '../services/tags.service';
import { Tag } from '../models/tag.model';
import { StatusCodeError } from '../errors/status-code.error';
import { KeyValueType } from '../dto/transaction-filter-sort-page.dto';

export class TagsController {
  static async getAll(req: Request, res: Response): Promise<Response<{ data: Tag[] }>> {
    try {
      const tags = await TagsService.getAll();
      return res.json({ data: tags });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async getOneById(req: Request, res: Response): Promise<Response<{ data: Tag }>> {
    try {
      const tag = await TagsService.getOneById(Number(req.params.id));
      return res.json({ data: tag });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async addOne(req: Request, res: Response): Promise<Response<{ data: Tag }>> {
    try {
      const newTag = await TagsService.addOne((req.body as KeyValueType).name as string);
      return res.json({ data: newTag });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async updateOne(req: Request, res: Response): Promise<Response<{ data: Tag }>> {
    try {
      const updatedTag = await TagsService.updateOne(Number(req.params.id), (req.body as KeyValueType).name as string);
      return res.json({ data: updatedTag });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async deleteOne(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await TagsService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }
}
