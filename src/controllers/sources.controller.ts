import { Request, Response } from 'express';

import { SourcesService } from '../services/sources.service';

export class SourcesController {
  static async getSources(req: Request, res: Response) {
    try {
      const sources = await SourcesService.getSources();
      return res.status(200).json({ data: sources });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  static async getSourceById(req: Request, res: Response) {
    try {
      const source = await SourcesService.getSourceById(Number(req.params.id));
      return res.status(200).json({ data: source });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  static async postSource(req: Request, res: Response) {
    try {
      const { name, description, currency, note_1, note_2, status_id } = req.body;
      const newSource = await SourcesService.addSource(name, description, currency, note_1, note_2, status_id);
      return res.json({ data: newSource });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  static async updateSource(req: Request, res: Response) {
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
      res.status(500).send({ message: e.message });
    }
  }

  static async deleteSource(req: Request, res: Response) {
    try {
      await SourcesService.deleteSource(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  }
}
