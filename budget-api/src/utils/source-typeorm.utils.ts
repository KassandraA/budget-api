import { Source } from "../models/source.model";
import { Equal, FindManyOptions, FindManyOptions as FindOneOptions, In } from "typeorm";

export class SourceTypeormUtils {
  public static findOneByName(name: string): FindOneOptions<Source> {
    const options: FindOneOptions<Source> = {
      where: { name: Equal(name) }
    }
    return options;
  }

  public static findManyByNames(names: string[]): FindManyOptions<Source> {
    const options: FindManyOptions<Source> = {
      where: {name: In(names)}
    }
    return options;
  }
}