import { In } from "typeorm";
import { NotFoundError } from '../errors/not-found.error';
import { NotUniqueError } from '../errors/not-unique.error';
import { Tag } from '../models/tag.model';
import { ValueNormalizer } from '../utils/value-normalizer.utils';

export class TagsService {
  static async getAll(): Promise<Tag[]> {
    return await Tag.find();
  }

  static async getOneById(tagId: number): Promise<Tag> {
    const tag = await Tag.findOneBy({ id: tagId });

    if (!tag) throw new NotFoundError('Tag not found');
    return tag;
  }

  static async getManyById(tagIds: number[]): Promise<Tag[]> {
    if (!tagIds || tagIds.length === 0) return [];

    const tags = await Tag.findBy({ id: In(tagIds) });

    if (tags.length !== tagIds.length) {
      const receivedTagIds = tags.map((t) => t.id);
      const missingTags = tagIds.filter((id) => !receivedTagIds.includes(+id)).join(', ');
      throw new NotFoundError('Some tags not found: ' + missingTags);
    }
    return tags;
  }

  static async getManyByNames(tagNames: string[]): Promise<Tag[]> {
    if (!tagNames || tagNames.length === 0) return [];

    return await Tag.findBy({ name: In([...new Set(tagNames)]) });
  }

  static async addOne(name: string): Promise<Tag> {
    const newTag = new Tag();
    newTag.name = ValueNormalizer.normalizeString(name) as string;

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
    const updatedTag = await Tag.findOneBy({ id: tagId });

    if (!updatedTag) throw new NotFoundError('Tag not found');
    updatedTag.name = ValueNormalizer.normalizeString(name) as string;

    return this.saveTag(updatedTag);
  }

  static async deleteOne(tagId: number): Promise<string> {
    const result = await Tag.delete(tagId);
    if (result.affected === 1) {
      return new Promise<string>((resolve) => { resolve('Deleted successfully') });
    } else {
      throw new NotFoundError('Tag not found');
    }
  }

  private static async saveTag(tag: Tag): Promise<Tag> {
    try {
      return await tag.save();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('UNIQUE constraint failed: tags.name')) {
        throw new NotUniqueError(`The name '${tag.name}' is already in use`);
      } else {
        throw error;
      }
    }
  }
}
