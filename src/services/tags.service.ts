import { NotFoundError } from '../errors/not-found.error';
import { NotUniqueError } from '../errors/not-unique.error';
import { Tag } from '../models/tag.model';

export class TagsService {
  static async getAll(): Promise<Tag[]> {
    return await Tag.find();
  }

  static async getOneById(tagId: number): Promise<Tag> {
    const tag = await Tag.findOne({
      id: tagId,
    });

    if (!tag) throw new NotFoundError('Tag not found');
    return tag;
  }

  static async addOne(name: string): Promise<Tag> {
    const new_tag = new Tag();
    new_tag.name = name;

    return this.saveTag(new_tag);
  }

  static async updateOne(tagId: number, name: string): Promise<Tag> {
    const updated_tag = await Tag.findOne({
      id: tagId,
    });

    if (!updated_tag) throw new NotFoundError('Tag not found');
    if (name !== undefined) updated_tag.name = name;

    return this.saveTag(updated_tag);
  }

  static async deleteOne(tagId: number) {
    const deleted_tag = await Tag.findOne({ id: tagId });
    // tslint:disable-next-line: no-debugger
    debugger;
    if (!deleted_tag) throw new NotFoundError('Tag not found');

    await deleted_tag.remove();
  }

  private static async saveTag(tag: Tag): Promise<Tag> {
    try {
      return await tag.save();
    } catch (error) {
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        throw new NotFoundError('status_id not found');
      } else if (error.message.includes('UNIQUE constraint failed: tags.name')) {
        throw new NotUniqueError(`The name '${tag.name}' is already in use`);
      } else {
        throw error;
      }
    }
  }
}
