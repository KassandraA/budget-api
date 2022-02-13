import { Transaction } from "src/models/transaction.model";
import { TransactionMetaDto } from "./transaction-meta.dto";

export interface TransactionResponseDto {
  data: Transaction[];
  meta: TransactionMetaDto;
}