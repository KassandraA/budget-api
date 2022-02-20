import { Account } from "../models/account.model";
import { Equal, FindManyOptions, FindManyOptions as FindOneOptions, In } from "typeorm";

export class AccountTypeormUtils {
  public static findOneByName(name: string): FindOneOptions<Account> {
    const options: FindOneOptions<Account> = {
      where: { name: Equal(name) }
    }
    return options;
  }

  public static findManyByNames(names: string[]): FindManyOptions<Account> {
    const options: FindManyOptions<Account> = {
      where: { name: In(names) }
    }
    return options;
  }
}