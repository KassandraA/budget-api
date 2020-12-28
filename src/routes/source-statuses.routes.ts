import { Router } from 'express';
import { SourceStatusValidator } from '../validators/source-status.validator';
import { SourceStatusesController } from '../controllers/source-statuses.controller';

const router = Router();

export class SourceStatusesRoutes {
  get routes() {
    router.get('', SourceStatusesController.getSourceStatuses);
    router.get('/:id([0-9]+)', SourceStatusesController.getSourceStatusById);
    router.post('', SourceStatusValidator.validateOnCreate, SourceStatusesController.createSourceStatus);
    router.patch('/:id([0-9]+)', SourceStatusValidator.validateOnUpdate, SourceStatusesController.updateSourceStatus);
    router.delete('/:id([0-9]+)', SourceStatusesController.deleteSourceStatus);

    return router;
  }
}
