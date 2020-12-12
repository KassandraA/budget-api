import { NotFoundError } from '../errors/not-found.error';
import { Transaction } from '../models/transaction.model';
// import { Between } from 'typeorm';
// import { TransactionRequestDto } from '../dto/transaction-request.dto';

export class TransactionsService {
  // static async getAll(): Promise<Transaction[]> {
  //   // const json = {
  //   //   where: data.filters.filter,
  //   //   order: data.filters.order,
  //   //   date: Between(data.dateFrom, data.dateTo),
  //   //   skip: data.filters.perPage * (data.filters.pageNumber - 1),
  //   //   take: data.filters.perPage,
  //   // };
  //   return await Transaction.find();
  // }
  // static async getOneById(transactionId: number): Promise<Transaction> {
  //   const transaction = await Transaction.findOne({
  //     id: transactionId,
  //   });
  //   if (!transaction) throw new NotFoundError('Transaction not found');
  //   return transaction;
  // }
  // static async addOne(
  //   date: Date,
  //   message: string,
  //   note_1: string,
  //   note_2: string,
  //   note_3: string,
  //   amount: number,
  //   source_id: number
  // ): Promise<Transaction> {
  //   const new_transaction = new Transaction();
  //   new_transaction.date = date;
  //   new_transaction.message = message;
  //   new_transaction.note_1 = note_1;
  //   new_transaction.note_2 = note_2;
  //   new_transaction.note_3 = note_3;
  //   new_transaction.amount = amount;
  //   new_transaction.source_id = source_id;
  //   return this.saveTransaction(new_transaction);
  // }
  // static async updateOne(
  //   transactionId: number,
  //   date: Date,
  //   message: string,
  //   note_1: string,
  //   note_2: string,
  //   note_3: string,
  //   amount: number,
  //   source_id: number
  // ): Promise<Transaction> {
  //   const updated_transaction = await Transaction.findOne({
  //     id: transactionId,
  //   });
  //   if (!updated_transaction) throw new NotFoundError('Transaction not found');
  //   if (date !== undefined) updated_transaction.date = date;
  //   if (message !== undefined) updated_transaction.message = message;
  //   if (note_1 !== undefined) updated_transaction.note_1 = note_1;
  //   if (note_2 !== undefined) updated_transaction.note_2 = note_2;
  //   if (note_3 !== undefined) updated_transaction.note_3 = note_3;
  //   if (amount !== undefined) updated_transaction.amount = amount;
  //   if (source_id !== undefined) updated_transaction.source_id = source_id;
  //   return this.saveTransaction(updated_transaction);
  // }
  // static async deleteOne(transactionId: number) {
  //   const deleted_source = await Transaction.findOne({ id: transactionId });
  //   if (!deleted_source) throw new NotFoundError('Transaction not found');
  //   await deleted_source.remove();
  // }
  // private static async saveTransaction(source: Transaction): Promise<Transaction> {
  //   try {
  //     return await source.save();
  //   } catch (error) {
  //     if (error.message.includes('FOREIGN KEY constraint failed')) {
  //       throw new NotFoundError('transaction_id not found');
  //     }
  //     // else if (error.message.includes('UNIQUE constraint failed: transactions.name')) {
  //     //   throw new NotUniqueError(`The name '${source.name}' is already in use`);
  //     // }
  //     else {
  //       throw error;
  //     }
  //   }
  // }
}
