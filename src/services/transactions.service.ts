import { Between } from 'typeorm';
import { TransactionRequestDto } from '../dto/transaction-request.dto';

export class TransactionsService {
  static getTransactions(data: TransactionRequestDto) {
    const json = {
      where: data.filters.filter,
      order: data.filters.order,
      date: Between(data.dateFrom, data.dateTo),
      skip: data.filters.perPage * (data.filters.pageNumber - 1),
      take: data.filters.perPage,
    };
  }
}
