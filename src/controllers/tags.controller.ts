import { Request, Response } from 'express';
import { TagsService } from '../services/tags.service';
import { Tag } from '../models/tag.model';

export class TagsController {
  static async getTags(req: Request, res: Response): Promise<Response<{ data: Tag[] }>> {
    try {
      const tags = await TagsService.getAll();
      return res.json({ data: tags });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async getTagById(req: Request, res: Response): Promise<Response<{ data: Tag }>> {
    try {
      const tag = await TagsService.getOneById(Number(req.params.id));
      return res.json({ data: tag });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async createTag(req: Request, res: Response): Promise<Response<{ data: Tag }>> {
    try {
      const newTag = await TagsService.addOne(req.body.name);
      return res.json({ data: newTag });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async updateTag(req: Request, res: Response): Promise<Response<{ data: Tag }>> {
    try {
      const updatedTag = await TagsService.updateOne(Number(req.params.id), req.body.name);
      return res.json({ data: updatedTag });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }

  static async deleteTag(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await TagsService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }
}
