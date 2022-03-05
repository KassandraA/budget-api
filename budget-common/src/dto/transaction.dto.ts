export interface TransactionDto {
  transactionId?: number;
  date: Date;
  message: string;
  amount: number;
  accountName: string;
  tagNames: string[];
}
