import { NotUniqueError } from '../errors/not-unique.error';
import { NotFoundError } from '../errors/not-found.error';
import { RemovalRestrictedError } from '../errors/removal-restricted.error';
import { SourceStatus } from '../models/source-status.model';

export class SourceStatusesService {
  static async getAll() {
    return await SourceStatus.find();
  }

  static async getOneById(source_status_id: number): Promise<SourceStatus> {
    const source_status = await SourceStatus.findOne({ id: source_status_id });

    if (!source_status) throw new NotFoundError('Source status not found');
    return source_status;
  }

  static async addOne(name: string, description: string): Promise<SourceStatus> {
    const new_source_status = new SourceStatus();
    new_source_status.name = name;
    new_source_status.description = description;

    return this.saveSourceStatus(new_source_status);
  }

  static async updateOne(source_status_id: number, name: string, description: string): Promise<SourceStatus> {
    const updated_source_status = await SourceStatus.findOne({ id: source_status_id });

    if (!updated_source_status) throw new NotFoundError('Source status not found');

    if (name !== undefined) updated_source_status.name = name;
    if (description !== undefined) updated_source_status.description = description;

    return this.saveSourceStatus(updated_source_status);
  }

  static async deleteOne(source_status_id: number) {
    const deleted_source_status = await SourceStatus.findOne({ id: source_status_id });
    if (!deleted_source_status) throw new NotFoundError('Source status not found');
    try {
      await deleted_source_status.remove();
    } catch (error) {
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        throw new RemovalRestrictedError(
          `The source status with id ${source_status_id} can not be deleted, it is used by at least one source`
        );
      } else {
        throw error;
      }
    }
  }

  private static async saveSourceStatus(source_status: SourceStatus): Promise<SourceStatus> {
    try {
      return await source_status.save();
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed: source_statuses.name')) {
        throw new NotUniqueError(`The name '${source_status.name}' is already in use`);
      } else {
        throw error;
      }
    }
  }
}
