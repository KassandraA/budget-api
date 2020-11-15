import { NotUniqueError } from '../errors/not-unique.error';
import { NotFoundError } from '../errors/not-found.error';
import { Source } from '../models/source.model';

export class SourcesService {
  /* GET sources */
  static async getAll(): Promise<Source[]> {
    return await Source.find();
  }

  /* GET sources by ID */
  static async getOneById(sourceId: number): Promise<Source> {
    const source = await Source.findOne({
      id: sourceId,
    });

    if (!source) throw new NotFoundError('Source not found');
    return source;
  }

  /* POST new source */
  static async addOne(
    name: string,
    description: string,
    currency: string,
    note_1: string,
    note_2: string,
    status_id: number
  ): Promise<Source> {
    const new_source = new Source();
    new_source.name = name;
    new_source.description = description;
    new_source.currency = currency;
    new_source.note_1 = note_1;
    new_source.note_2 = note_2;
    new_source.status_id = status_id;

    return this.saveSource(new_source);
  }

  /* PUT source */
  static async updateOne(
    sourceId: number,
    name: string,
    description: string,
    currency: string,
    note_1: string,
    note_2: string,
    status_id: number
  ): Promise<Source> {
    const updated_source = await Source.findOne({
      id: sourceId,
    });

    if (!updated_source) throw new NotFoundError('Source not found');

    if (name !== undefined) updated_source.name = name;
    if (description !== undefined) updated_source.description = description;
    if (currency !== undefined) updated_source.currency = currency;
    if (note_1 !== undefined) updated_source.note_1 = note_1;
    if (note_2 !== undefined) updated_source.note_2 = note_2;
    if (status_id !== undefined) updated_source.status_id = status_id;

    return this.saveSource(updated_source);
  }

  /* DELETE source */
  static async deleteOne(sourceId: number) {
    const deleted_source = await Source.findOne({ id: sourceId });
    if (!deleted_source) throw new NotFoundError('Source not found');

    await deleted_source.remove();
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
