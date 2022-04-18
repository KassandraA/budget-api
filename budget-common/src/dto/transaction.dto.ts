import { Property } from "../../../budget-api/src/models/property.model";

export interface TransactionDto {
  transactionId?: number;
  date: Date;
  message: string;
  transactor: string;
  amount: number;
  accountName: string;
  tagNames: string[];
  properties?: Property[]
}
