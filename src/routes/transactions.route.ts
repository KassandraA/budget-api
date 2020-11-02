import { Router } from 'express';
import { TransactionsController } from '../controllers/transactions.controller';

const router = Router();
const PREFIX = '/api/v1';

class TransactionRoutes {
  get routes() {
    router.post(`${PREFIX}/transactions`, TransactionsController.getTransactions);

    return router;
  }
}

export { TransactionRoutes };
