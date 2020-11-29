import { Router } from 'express';
import { SourceValidator } from '../validators/source.validator';
import { SourcesController } from '../controllers/sources.controller';

const router = Router();

export class SourcesRoutes {
  get routes() {
    router.get('', SourcesController.getSources);
    router.get('/:id([0-9]+)', SourcesController.getSourceById);
    router.post('', SourceValidator.validateOnCreate, SourcesController.createSource);
    router.put('/:id([0-9]+)', SourceValidator.validateOnUpdate, SourcesController.updateSource);
    router.delete('/:id([0-9]+)', SourcesController.deleteSource);
    return router;
  }
}
