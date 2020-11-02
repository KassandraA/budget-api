import { Request, Response } from 'express';
import { SourceStatus } from '../models/source-status.model';

export class SourceStatusesController {
  static test = async (req: Request, res: Response) => {
    res.send('Test response');
  };

  static async getAll(req: Request, res: Response) {
    const source_statuses = await SourceStatus.find();
    res.send(source_statuses);
  }

  static async getOneById(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      const source_status = await SourceStatus.findOneOrFail(id, {
        select: ['id', 'name', 'description', 'sources'],
      });
      res.send(source_status);
    } catch (error) {
      res.status(404).send('Source status not found');
    }
  }

  static async add(req: Request, res: Response) {
    const { name, description } = req.body;

    const source_status = new SourceStatus();
    source_status.name = name;
    source_status.description = description;

    try {
      await source_status.save();
    } catch (e) {
      res.status(409).send('Error: ' + e.message);
      return;
    }

    res.status(201).send(source_status);
  }
}
