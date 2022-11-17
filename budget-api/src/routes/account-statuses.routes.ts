import { RequestHandler, Router } from 'express';
import { AccountStatusValidator } from '../validators/account-status.validator';
import { AccountStatusesController } from '../controllers/account-statuses.controller';

const router = Router();

export class AccountStatusesRoutes {
  get routes() {
    router.get('', (AccountStatusesController.getAll as RequestHandler));
    router.get('/:id([0-9]+)', (AccountStatusesController.getOneById as RequestHandler));
    router.post('', AccountStatusValidator.validateOnCreate, AccountStatusesController.addOne);
    router.patch('/:id([0-9]+)', AccountStatusValidator.validateOnUpdate, AccountStatusesController.updateOne);
    router.delete('/:id([0-9]+)', (AccountStatusesController.deleteOne as RequestHandler));
    return router;
  }
}
