import { TransactionDto } from "../dto/transaction.dto";

export class TransactionConverter {
    public static toTransactionDto(data: any): TransactionDto {
       return {
         message: data.message,
         note1: data.note_1,
         note2: data.note_2,
         note3: data.note_3,
         date: data.date,
         amount: data.amount,
         sourceId: data.source_id,
         tagIds: data.tag_ids,
       };
     }
}