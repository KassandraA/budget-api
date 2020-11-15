import { Request, Response } from 'express';
import { SourceStatusesService } from '../services/source-statuses.service';
import { SourceStatus } from '../models/source-status.model';
import { NotFoundError } from '../errors/not-found.error';
import { NotUniqueError } from '../errors/not-unique.error';
import { RemovalRestrictedError } from '../errors/removal-restricted.error';

export class SourceStatusesController {
  static async getSourceStatuses(req: Request, res: Response): Promise<Response<SourceStatusesService>> {
    try {
      const source_statuses = await SourceStatusesService.getAll();
      return res.json({ data: source_statuses });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  static async getSourceStatusById(req: Request, res: Response): Promise<Response<SourceStatusesService>> {
    try {
      const source_status = await SourceStatusesService.getOneById(Number(req.params.id));
      return res.json({ data: source_status });
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).json({ message: e.message });
      }
      return res.status(500).json({ message: e.message });
    }
  }

  static async createSourceStatus(req: Request, res: Response): Promise<Response<SourceStatusesService>> {
    try {
      const { name, description } = req.body;
      const new_source_status = await SourceStatusesService.addOne(name, description);
      return res.json({ data: new_source_status });
    } catch (e) {
      if (e instanceof NotFoundError) {
        return res.status(404).json({ message: e.message });
      } else if (e instanceof NotUniqueError) {
        return res.status(400).json({ message: e.message });
      }
      return res.status(500).json({ message: e.message });
    }
  }

  static async updateSourceStatus(req: Request, res: Response): Promise<Response<SourceStatus>> {
    try {
      const source_status: {
        source_status_id: number;
        name: string;
        description: string;
      } = req.body;

      source_status.source_status_id = Number(req.params.id);

      const updated_source_status = await SourceStatusesService.updateOne(
        source_status.source_status_id,
        source_status.name,
        source_status.description
      );
      return res.json({ data: updated_source_status });
    } catch (e) {
      if (e instanceof NotFoundError) {
        return res.status(404).json({ message: e.message });
      } else if (e instanceof NotUniqueError) {
        return res.status(400).json({ message: e.message });
      }
      res.status(500).json({ message: e.message });
    }
  }

  static async deleteSourceStatus(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      await SourceStatusesService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e) {
      if (e instanceof NotFoundError) {
        return res.status(404).json({ message: e.message });
      } else if (e instanceof RemovalRestrictedError) {
        return res.status(400).json({ message: e.message });
      }
      res.status(500).send({ message: e.message });
    }
  }
}
