import { NotUniqueError } from '../errors/not-unique.error';
import { NotFoundError } from '../errors/not-found.error';
import { Source } from '../models/source.model';

export class SourcesService {
  static async getAll(): Promise<Source[]> {
    return await Source.find();
  }

  static async getOneById(sourceId: number): Promise<Source> {
    const source = await Source.findOne({
      id: sourceId,
    });

    if (!source) throw new NotFoundError('Source not found');
    return source;
  }

  static async addOne(
    name: string,
    description: string,
    currency: string,
    note1: string,
    note2: string,
    statusId: number
  ): Promise<Source> {
    const newSource = new Source();
    newSource.name = name;
    newSource.description = description;
    newSource.currency = currency;
    newSource.note_1 = note1;
    newSource.note_2 = note2;
    newSource.status_id = statusId;

    return this.saveSource(newSource);
  }

  static async updateOne(
    sourceId: number,
    name: string,
    description: string,
    currency: string,
    note1: string,
    note2: string,
    statusId: number
  ): Promise<Source> {
    const updatedSource = await Source.findOne({
      id: sourceId,
    });

    if (!updatedSource) throw new NotFoundError('Source not found');

    if (name !== undefined) updatedSource.name = name;
    if (description !== undefined) updatedSource.description = description;
    if (currency !== undefined) updatedSource.currency = currency;
    if (note1 !== undefined) updatedSource.note_1 = note1;
    if (note2 !== undefined) updatedSource.note_2 = note2;
    if (statusId !== undefined) updatedSource.status_id = statusId;

    return this.saveSource(updatedSource);
  }

  static async deleteOne(sourceId: number) {
    const deletedSource = await Source.findOne({ id: sourceId });
    if (!deletedSource) throw new NotFoundError('Source not found');

    await deletedSource.remove();
  }

  private static async saveSource(source: Source): Promise<Source> {
    try {
      return await source.save();
    } catch (error) {
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        throw new NotFoundError('status_id not found');
      } else if (error.message.includes('UNIQUE constraint failed: sources.name')) {
        throw new NotUniqueError(`The name '${source.name}' is already in use`);
      } else {
        throw error;
      }
    }
  }
}
