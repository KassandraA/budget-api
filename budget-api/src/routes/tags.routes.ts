import { Router } from 'express';
import { TagValidator } from '../validators/tag.validator';
import { TagsController } from '../controllers/tags.controller';

const router = Router();

export class TagsRoutes {
  get routes() {
    router.get('', TagsController.getAll);
    router.get('/:id([0-9]+)', TagsController.getOneById);
    router.post('', TagValidator.validateOnCreate, TagsController.addOne);
    router.patch('/:id([0-9]+)', TagValidator.validateOnUpdate, TagsController.updateOne);
    router.delete('/:id([0-9]+)', () => TagsController.deleteOne);
    return router;
  }
}
