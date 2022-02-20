import { TransactionDto } from "../../../budget-common/src/dto/transaction.dto";
import { ValueNormalizer } from "./value-normalizer.utils";
import { Transaction } from "../models/transaction.model";
import { Tag } from "../models/tag.model";
import { Account } from "../models/account.model";

export class TransactionConverter {
  public static asDto(data: any): TransactionDto {
    return {
      message: data.message,
      note1: data.note_1,
      note2: data.note_2,
      note3: data.note_3,
      date: data.date,
      amount: data.amount,
      accountName: data.account_name,
      tagNames: data.tag_names
    };
  }

  public static fromDto(data: TransactionDto, account: Account, tags: Tag[]): Transaction {
    const newTransaction = new Transaction();

    newTransaction.date = data.date;
    newTransaction.message = ValueNormalizer.normalizeString(data.message);
    newTransaction.note_1 = ValueNormalizer.normalizeString(data.note1);
    newTransaction.note_2 = ValueNormalizer.normalizeString(data.note2);
    newTransaction.note_3 = ValueNormalizer.normalizeString(data.note3);
    newTransaction.amount = data.amount;
    newTransaction.account_id = account.id;
    newTransaction.tags = tags;

    return newTransaction;
  }
}