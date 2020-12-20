import { Router } from 'express';
import { TransactionValidator } from '../validators/transaction.validator';
import { TransactionsController } from '../controllers/transactions.controller';

const router = Router();

export class TransactionsRoutes {
  get routes() {
    router.get('', TransactionsController.getTransactions);
    router.get('/:id([0-9]+)', TransactionsController.getTransactionById);
    router.post('', TransactionValidator.validateOnCreate, TransactionsController.createTransaction);
    router.put('/:id([0-9]+)', TransactionValidator.validateOnUpdate, TransactionsController.updateTransaction);
    router.delete('/:id([0-9]+)', TransactionsController.deleteTransaction);

    return router;
  }
}
