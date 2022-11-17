import { RequestHandler, Router } from 'express';
import { AccountValidator } from '../validators/account.validator';
import { AccountsController } from '../controllers/accounts.controller';

const router = Router();

export class AccountsRoutes {
  get routes() {
    router.get('', (AccountsController.getAll as RequestHandler));
    router.get('/:id([0-9]+)', (AccountsController.getOneById as RequestHandler));
    router.post('', AccountValidator.validateOnCreate, AccountsController.addOne);
    router.patch('/:id([0-9]+)', AccountValidator.validateOnUpdate, AccountsController.updateOne);
    router.delete('/:id([0-9]+)', (AccountsController.deleteOne as RequestHandler));
    return router;
  }
}
