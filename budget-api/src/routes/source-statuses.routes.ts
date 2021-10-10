import { Router } from 'express';
import { SourceStatusValidator } from '../validators/source-status.validator';
import { SourceStatusesController } from '../controllers/source-statuses.controller';

const router = Router();

export class SourceStatusesRoutes {
  get routes() {
    router.get('', SourceStatusesController.getAll);
    router.get('/:id([0-9]+)', SourceStatusesController.getOneById);
    router.post('', SourceStatusValidator.validateOnCreate, SourceStatusesController.addOne);
    router.patch('/:id([0-9]+)', SourceStatusValidator.validateOnUpdate, SourceStatusesController.updateOne);
    router.delete('/:id([0-9]+)', SourceStatusesController.deleteOne);
    return router;
  }
}
