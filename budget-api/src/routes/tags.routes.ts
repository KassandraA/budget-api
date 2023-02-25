import { RequestHandler, Router } from 'express';
import { TagValidator } from '../validators/tag.validator';
import { TagsController } from '../controllers/tags.controller';

const router = Router();

export class TagsRoutes {
  get routes() {
    router.get('', (TagsController.getAll as RequestHandler));
    router.get('/:id([0-9]+)', TagsController.getOneById);
    router.post('', TagValidator.validateOnCreateOrUpdate, TagsController.addOne);
    router.patch('/:id([0-9]+)', TagValidator.validateOnCreateOrUpdate, TagsController.updateOne);
    router.delete('/:id([0-9]+)', TagsController.deleteOne);
    return router;
  }
}
