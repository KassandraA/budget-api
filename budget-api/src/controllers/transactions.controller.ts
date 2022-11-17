import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { TransactionsService } from '../services/transactions.service';
import { KeyValueType, TransactionFilterSortPageDto } from '../dto/transaction-filter-sort-page.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { TransactionTypeormUtils } from '../utils/transaction-typeorm.utils';
import { TransactionConverter } from '../utils/transaction-converter.utils';
import { StatusCodeError } from '../errors/status-code.error';
import { TransactionDto } from '../../../budget-common/src/dto/transaction.dto';

export class TransactionsController {
  static async getMany(
    req: Request,
    res: Response
  ): Promise<Response<TransactionResponseDto>> {
    try {
      const dto = TransactionTypeormUtils.isFilterSortPageDto(req?.query)
        ? (req.query as TransactionFilterSortPageDto)
        : undefined;

      const transactions = await TransactionsService.getMany(dto);
      return res.json(transactions);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async getOneById(
    req: Request,
    res: Response
  ): Promise<Response<{ data: Transaction }>> {
    try {
      const transaction = await TransactionsService.getOneById(Number(req.params.id));
      return res.json({ data: transaction });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async addMany(
    req: Request,
    res: Response
  ): Promise<Response<{ data: Transaction[] }>> {
    try {
      const newTransactions = await TransactionsService.addMany(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (req.body as KeyValueType).map((i: KeyValueType) => TransactionConverter.asDto(i)) as TransactionDto[]
      );
      return res.json({ data: newTransactions });
    } catch (e: Error | any) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async updateOne(
    req: Request,
    res: Response
  ): Promise<Response<{ data: Transaction }>> {
    try {
      const updatedTransaction = await TransactionsService.updateOne(
        Number(req.params.id),
        TransactionConverter.asDto(req.body as KeyValueType)
      );
      return res.json({ data: updatedTransaction });
    } catch (e: Error | any) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }

  static async deleteOne(
    req: Request,
    res: Response
  ): Promise<Response<{ message: string }>> {
    try {
      await TransactionsService.deleteOne(Number(req.params.id));
      return res.json({ message: 'Deleted successfully' });
    } catch (e: Error | any) {
      const message = e instanceof Error ? e.message : String(e);
      const errorCode = e instanceof StatusCodeError ? e.statusCode : 500;
      return res.status(errorCode).json({ message: message });
    }
  }
}
