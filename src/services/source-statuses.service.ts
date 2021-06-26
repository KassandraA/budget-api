import { NotUniqueError } from '../errors/not-unique.error';
import { NotFoundError } from '../errors/not-found.error';
import { RemovalRestrictedError } from '../errors/removal-restricted.error';
import { SourceStatus } from '../models/source-status.model';
import { ValueNormalizer } from '../utils/value-normalizer.utils';

export class SourceStatusesService {
  static async getAll() {
    return await SourceStatus.find();
  }

  static async getOneById(sourceStatusId: number): Promise<SourceStatus> {
    const sourceStatus = await SourceStatus.findOne({ id: sourceStatusId });

    if (!sourceStatus) throw new NotFoundError('Source status not found');
    return sourceStatus;
  }

  static async addOne(name: string, description: string): Promise<SourceStatus> {
    const newSourceStatus = new SourceStatus();
    newSourceStatus.name = name;
    newSourceStatus.description = ValueNormalizer.normalizeString(description);

    return this.saveSourceStatus(newSourceStatus);
  }

  static async updateOne(
    sourceStatusId: number,
    name: string,
    description: string
  ): Promise<SourceStatus> {
    const updatedSourceStatus = await SourceStatus.findOne({ id: sourceStatusId });

    if (!updatedSourceStatus) throw new NotFoundError('Source status not found');

    if (name !== undefined) updatedSourceStatus.name = name;
    if (description !== undefined)
      updatedSourceStatus.description = ValueNormalizer.normalizeString(description);

    return this.saveSourceStatus(updatedSourceStatus);
  }

  static async deleteOne(sourceStatusId: number) {
    const deletedSourceStatus = await SourceStatus.findOne({ id: sourceStatusId });
    if (!deletedSourceStatus) throw new NotFoundError('Source status not found');
    try {
      await deletedSourceStatus.remove();
    } catch (error) {
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        throw new RemovalRestrictedError(
          `The source status with id ${sourceStatusId} can not be deleted, it is used by at least one source`
        );
      } else {
        throw error;
      }
    }
  }

  private static async saveSourceStatus(sourceStatus: SourceStatus): Promise<SourceStatus> {
    try {
      return await sourceStatus.save();
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed: source_statuses.name')) {
        throw new NotUniqueError(`The name '${sourceStatus.name}' is already in use`);
      } else {
        throw error;
      }
    }
  }
}
