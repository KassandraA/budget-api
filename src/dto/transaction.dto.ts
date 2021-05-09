export interface TransactionDto {
  transactionId?: number;
  date: Date;
  message: string;
  note1: string;
  note2: string;
  note3: string;
  amount: number;
  sourceId: number;
  tagIds: number[];
}
