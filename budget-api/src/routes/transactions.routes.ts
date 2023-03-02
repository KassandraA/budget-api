import { Router } from "express";
import { TransactionValidator } from "../validators/transaction.validator";
import { TransactionsController } from "../controllers/transactions.controller";
import {
  TypedRequest,
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestQuery,
  TypedResponse
} from "../utils/express/typed-request";
import { TransactionFilterSortPageDto } from "../dto/transaction-filter-sort-page.dto";
import { TransactionResponseDto } from "../dto/transaction-response.dto";
import { Transaction } from "../models/transaction.model";
import { TransactionDto } from "../../../budget-common/src/dto/transaction.dto";

const router = Router();

export class TransactionsRoutes {
  get routes() {
    router.get(
      "",
      TransactionValidator.validateOnGet,
      (
        req: TypedRequestQuery<TransactionFilterSortPageDto>,
        res: TypedResponse<TransactionResponseDto>
      ) => TransactionsController.getMany(req, res)
    );

    router.get(
      "/:id([0-9]+)",
      (
        req: TypedRequestParams<{ id: string }>,
        res: TypedResponse<Transaction>
      ) => TransactionsController.getOneById(req, res)
    );

    router.post(
      "",
      TransactionValidator.validateOnCreate,
      (
        req: TypedRequestBody<TransactionDto[]>,
        res: TypedResponse<Transaction[]>
      ) => TransactionsController.addMany(req, res)
    );

    router.patch(
      "/:id([0-9]+)",
      TransactionValidator.validateOnUpdate,
      (
        req: TypedRequest<{ id: string }, TransactionDto>,
        res: TypedResponse<Transaction>
      ) => TransactionsController.updateOne(req, res)
    );

    router.delete(
      "/:id([0-9]+)",
      (
        req: TypedRequestParams<{ id: string }>,
        res: TypedResponse<string>
      ) => TransactionsController.deleteOne(req, res)
    );
    
    return router;
  }
}
