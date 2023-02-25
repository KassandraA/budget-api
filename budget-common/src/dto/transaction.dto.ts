export interface TransactionDto {
  date: Date;
  message?: string;
  transactor: string;
  amount: number;
  accountName: string;
  tagNames?: string[];
  properties?: { [key: string]: string };
}
