import { Source } from '../models/source.model';

export class SourcesService {
  /* GET sources */
  static async getSources() {
    return await Source.find();
  }

  /* GET sources by ID */
  static async getSourceById(sourceId: number) {
    return await Source.findOne({ id: sourceId });
  }

  /* POST new source */
  static async addSource(
    name: string,
    description: string,
    currency: string,
    note_1: string,
    note_2: string,
    status_id: number
  ) {
    const new_source = new Source();
    new_source.name = name;
    new_source.description = description;
    new_source.currency = currency;
    new_source.note_1 = note_1;
    new_source.note_2 = note_2;
    new_source.status_id = status_id;

    return await new_source.save();
  }

  /* PUT source */
  static async updateSource(
    sourceId: number,
    name: string,
    description: string,
    currency: string,
    note_1: string,
    note_2: string,
    status_id: number
  ) {
    const updated_source = await Source.findOne({
      id: sourceId,
    });

    if (!updated_source) throw Error('Source not found');

    if (name !== undefined) updated_source.name = name;
    if (description !== undefined) updated_source.description = description;
    if (currency !== undefined) updated_source.currency = currency;
    if (note_1 !== undefined) updated_source.note_1 = note_1;
    if (note_2 !== undefined) updated_source.note_2 = note_2;
    if (status_id !== undefined) updated_source.status_id = status_id;

    return await updated_source.save();
  }

  /* DELETE source */
  static async deleteSource(sourceId: number) {
    const deleted_source = await Source.findOne({ id: sourceId });
    if (!deleted_source) throw Error('Source not found');
    await deleted_source.remove();
  }
}
