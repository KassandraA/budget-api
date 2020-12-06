import { Router } from 'express';
import { TagValidator } from '../validators/tag.validator';
import { TagsController } from '../controllers/tags.controller';

const router = Router();

export class TagsRoutes {
  get routes() {
    router.get('', TagsController.getTags);
    router.get('/:id([0-9]+)', TagsController.getTagById);
    router.post('', TagValidator.validateOnCreate, TagsController.createTag);
    router.put('/:id([0-9]+)', TagValidator.validateOnUpdate, TagsController.updateTag);
    router.delete('/:id([0-9]+)', TagsController.deleteTag);
    return router;
  }
}
