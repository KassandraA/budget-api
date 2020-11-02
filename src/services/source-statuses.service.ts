import { SourceStatus } from '../models/source-status.model';

export class SourceStatusesService {
  static async getAll() {
    return await SourceStatus.find();
  }
}
