import { TransactionDto } from "../../../budget-common/src/dto/transaction.dto";
import { ValueNormalizer } from "./value-normalizer.utils";
import { Transaction } from "../models/transaction.model";
import { Tag } from "../models/tag.model";
import { Account } from "../models/account.model";
import { Property } from "../models/property.model";
import { KeyValueType } from "../dto/transaction-filter-sort-page.dto";

export class TransactionConverter {
  public static asDto(data: KeyValueType): TransactionDto {
    return {
      message: data.message as string,
      transactor: data.transactor as string,
      date: data.date as Date,
      amount: data.amount as number,
      accountName: data.accountName as string,
      tagNames: data.tagNames as string[],
      properties: new Map(Object.entries(data.properties as Map<string, string>))
    };
  }

  public static fromDto(data: TransactionDto, account: Account, tags: Tag[], properties: Property[]): Transaction {
    const newTransaction = new Transaction();

    newTransaction.date = data.date;
    newTransaction.message = ValueNormalizer.normalizeString(data.message);
    newTransaction.amount = data.amount;
    newTransaction.account_id = account.id;
    newTransaction.tags = tags;
    newTransaction.transactor = data.transactor;
    newTransaction.properties = properties;

    return newTransaction;
  }
}