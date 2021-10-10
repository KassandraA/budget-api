import { Router } from 'express';
import { SourceValidator } from '../validators/source.validator';
import { SourcesController } from '../controllers/sources.controller';

const router = Router();

export class SourcesRoutes {
  get routes() {
    router.get('', SourcesController.getAll);
    router.get('/:id([0-9]+)', SourcesController.getOneById);
    router.post('', SourceValidator.validateOnCreate, SourcesController.addOne);
    router.patch('/:id([0-9]+)', SourceValidator.validateOnUpdate, SourcesController.updateOne);
    router.delete('/:id([0-9]+)', SourcesController.deleteOne);
    return router;
  }
}
