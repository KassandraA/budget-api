import { NotFoundError } from '../errors/not-found.error';
import { NotUniqueError } from '../errors/not-unique.error';
import { Tag } from '../models/tag.model';
import { ValueNormalizer } from '../utils/value-normalizer.utils';
import { TagTypeormUtils } from '../utils/tag-typeorm.utils';

export class TagsService {
  static async getAll(): Promise<Tag[]> {
    return await Tag.find();
  }

  static async getOneById(tagId: number): Promise<Tag> {
    const tag = await Tag.findOneBy({
      id: tagId,
    });

    if (!tag) throw new NotFoundError('Tag not found');
    return tag;
  }

  static async getManyById(tagIds: number[]): Promise<Tag[]> {
    if (!tagIds || tagIds.length === 0) return [];

    const tags = await Tag.findByIds(tagIds);

    if (tags.length !== tagIds.length) {
      const receivedTagIds = tags.map((t) => t.id);
      const missingTags = tagIds.filter((id) => !receivedTagIds.includes(+id)).join(', ');
      throw new NotFoundError('Some tags not found: ' + missingTags);
    }
    return tags;
  }

  static async getManyByNames(tagNames: string[]): Promise<Tag[]> {
    if (!tagNames || tagNames.length === 0) return [];

    return await Tag.find(TagTypeormUtils.findManyByNames([...new Set(tagNames)]));
  }

  static async addOne(name: string): Promise<Tag> {
    const newTag = new Tag();
    newTag.name = ValueNormalizer.normalizeString(name);

    return this.saveTag(newTag);
  }

  static async addMany(names: string[]): Promise<Tag[]> {
    const uniqueNames = [...new Set(names)];
    const existingTags = await TagsService.getManyByNames(uniqueNames);
    const existingTagNames = new Set(existingTags.map((t) => t.name));

    if (uniqueNames.length > existingTags.length) {
      const newTagNames = uniqueNames.filter((tName) => !existingTagNames.has(tName));
      const newTags = await Tag.save(newTagNames.map((n) => {
        const tag = new Tag();
        tag.name = n;
        return tag;
      }));
      return [...existingTags, ...newTags];
    } else {
      return existingTags;
    }
  }

  static async updateOne(tagId: number, name: string): Promise<Tag> {
    const updatedTag = await Tag.findOneBy({
      id: tagId,
    });

    if (!updatedTag) throw new NotFoundError('Tag not found');
    if (name !== undefined) updatedTag.name = ValueNormalizer.normalizeString(name);

    return this.saveTag(updatedTag);
  }

  static async deleteOne(tagId: number) {
    const deletedTag = await Tag.findOneBy({ id: tagId });
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
