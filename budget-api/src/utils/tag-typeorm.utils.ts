import { Tag } from "../models/tag.model";
import { FindManyOptions, In } from "typeorm";

export class TagTypeormUtils {
  public static findManyByNames(tagNames: string[]): FindManyOptions<Tag> {
    const options: FindManyOptions<Tag> = {
      where: { name: In(tagNames) }
    }
    return options;
  }
}