import { TransactionDto } from "../../../budget-common/src/dto/transaction.dto";
import { ValueNormalizer } from "./value-normalizer.utils";
import { Transaction } from "../models/transaction.model";
import { Tag } from "../models/tag.model";
import { Account } from "../models/account.model";
import { Property } from "../models/property.model";

export class TransactionConverter {
  public static asDto(data: any): TransactionDto {
    return {
      message: data.message,
      transactor: data.transactor,
      date: data.date,
      amount: data.amount,
      accountName: data.accountName,
      tagNames: data.tagNames,
      properties: new Map(Object.entries(data.properties))
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