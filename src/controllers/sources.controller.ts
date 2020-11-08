import { Request, Response } from 'express';
import { NotUniqueError } from '../errors/not-unique.error';
import { NotFoundError } from '../errors/not-found.error';
import { SourcesService } from '../services/sources.service';
import { Source } from '../models/source.model';

export class SourcesController {
  static async getSources(req: Request, res: Response): Promise<Response<{ data: Source[] }>> {
    try {
      const sources = await SourcesService.getSources();
      return res.json({ data: sources });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  static async getSourceById(req: Request, res: Response): Promise<Response<{ data: Source }>> {
    try {
      const source = await SourcesService.getSourceById(Number(req.params.id));
      return res.json({ data: source });
    } catch (e) {
      if (e instanceof NotFoundError) {
        return res.status(404).json({ message: e.message });
      }
      return res.status(500).json({ message: e.message });
    }
  }

  static async createSource(req: Request, res: Response): Promise<Response<{ data: Source }>> {
    try {
      const { name, description, currency, note_1, note_2, status_id } = req.body;
      const newSource = await SourcesService.addSource(name, description, currency, note_1, note_2, status_id);
      return res.json({ data: newSource });
    } catch (e) {
      if (e instanceof NotFoundError) {
        return res.status(400).json({ message: e.message });
      } else if (e instanceof NotUniqueError) {
        return res.status(400).json({ message: e.message });
      }
      return res.status(500).json({ message: e.message });
    }
  }

  static async updateSource(req: Request, res: Response): Promise<Response<{ data: Source }>> {
    try {
      const source: {
        sourceId: number;
        name: string;
        description: string;
        currency: string;
        note_1: string;
        note_2: string;
        status_id: number;
      } = req.body;

      source.sourceId = Number(req.params.id);

      const updatedSource = await SourcesService.updateSource(
        Number(req.params.id),
        source.name,
        source.description,
        source.currency,
        source.note_1,
        source.note_2,
        source.status_id
      );
      return res.json({ data: updatedSource });
    } catch (e) {
      if (e instanceof NotFoundError) {
        return res.status(400).json({ message: e.message });
      } else if (e instanceof NotUniqueError) {
        return res.status(400).json({ message: e.message });
      }
      res.status(500).send({ message: e.message });
    }
  }

  static async deleteSource(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await SourcesService.deleteSource(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      if (e instanceof NotFoundError) {
        return res.status(404).json({ message: e.message });
      }
      res.status(500).send({ message: e.message });
    }
  }
}
