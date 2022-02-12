import { TransactionDto } from '../../../budget-common/src/dto/transaction.dto';

export interface ParsedBankDataDto {
  transactions: TransactionDto[];
}