import { RemovalRestrictedError } from '../errors/removal-restricted.error';
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

  static async getManyById(tagIds: number[]): Promise<Tag[]> {
    const tags = await Tag.findByIds(tagIds);

    if (tags.length !== tagIds.length) {
      const receivedTagIds = tags.map((t) => t.id);
      const missingTags = tagIds.filter((id) => !receivedTagIds.includes(+id)).join(', ');
      throw new NotFoundError('Some tags not found: ' + missingTags);
    }
    return tags;
  }

  static async addOne(name: string): Promise<Tag> {
    const newTag = new Tag();
    newTag.name = name;

    return this.saveTag(newTag);
  }

  static async updateOne(tagId: number, name: string): Promise<Tag> {
    const updatedTag = await Tag.findOne({
      id: tagId,
    });

    if (!updatedTag) throw new NotFoundError('Tag not found');
    if (name !== undefined) updatedTag.name = name;

    return this.saveTag(updatedTag);
  }

  static async deleteOne(tagId: number) {
    const deletedTag = await Tag.findOne({ id: tagId });
    if (!deletedTag) throw new NotFoundError('Tag not found');

    await deletedTag.remove();
  }

  private static async saveTag(tag: Tag): Promise<Tag> {
    try {
      return await tag.save();
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed: tags.name')) {
        throw new NotUniqueError(`The name '${tag.name}' is already in use`);
      } else {
        throw error;
      }
    }
  }
}
