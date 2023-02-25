import { Router } from 'express';
import { TransactionValidator } from '../validators/transaction.validator';
import { TransactionsController } from '../controllers/transactions.controller';

const router = Router();

export class TransactionsRoutes {
  get routes() {
    router.get('', TransactionValidator.validateOnGet, TransactionsController.getMany);
    router.get('/:id([0-9]+)', TransactionsController.getOneById);
    router.post('', TransactionValidator.validateOnCreate, TransactionsController.addMany);
    router.patch('/:id([0-9]+)', TransactionValidator.validateOnUpdate, TransactionsController.updateOne);
    router.delete('/:id([0-9]+)', TransactionsController.deleteOne);
    return router;
  }
}
