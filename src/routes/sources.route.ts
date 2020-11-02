import { Router } from 'express';
import { SourceValidator } from '../validators/source.validator';
import { SourcesController } from '../controllers/sources.controller';

const router = Router();

export class SourcesRoute {
  get routes() {
    router.get('', SourcesController.getSources);
    router.get('/:id', SourcesController.getSourceById);
    router.post('', SourceValidator.validateSource, SourcesController.postSource);
    router.put('/:id', SourcesController.updateSource);
    router.delete('/:id', SourcesController.deleteSource);
    return router;
  }
}
