import { Transaction } from '../models/transaction.model';
import { TransactionsService } from '../services/transactions.service';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { TransactionDto } from '../../../budget-common/src/dto/transaction.dto';
import { BaseController } from './abstract/controller.base';
import { TypedRequestQuery, TypedRequest, TypedRequestBody, TypedRequestParams, TypedResponse } from '../utils/express/typed-request';
import { TransactionFilterSortPageDto } from '../dto/transaction-filter-sort-page.dto';

export class TransactionsController {
  static getMany(
    req: TypedRequestQuery<TransactionFilterSortPageDto>,
    res: TypedResponse<TransactionResponseDto>
  ): void {
    TransactionsService.getMany(req.query)
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static getOneById(
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<Transaction>
  ): void {
    TransactionsService.getOneById(Number(req.params.id))
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static addMany(
    req: TypedRequestBody<TransactionDto[]>,
    res: TypedResponse<Transaction[]>
  ): void {
    TransactionsService.addMany(req.body)
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static updateOne(
    req: TypedRequest<{ id: string }, TransactionDto>,
    res: TypedResponse<Transaction>
  ): void {
    TransactionsService.updateOne(Number(req.params.id), req.body)
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static deleteOne(
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<string>
  ): void {
    TransactionsService.deleteOne(Number(req.params.id))
      .then((data) => res.json({ message: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }
}
