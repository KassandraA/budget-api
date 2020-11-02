import { Router } from 'express';
import { SourceStatusesController } from '../controllers/source-statuses.controller';

const router = Router();
const PREFIX = '/api/v1';

class SourceStatusesRoutes {
  get routes() {
    router.get(`${PREFIX}/source-statuses`, SourceStatusesController.getAll);
    router.get(`${PREFIX}/source-statuses/:id([0-9]+)`, SourceStatusesController.getOneById);
    router.post(`${PREFIX}/source-statuses`, SourceStatusesController.add);

    return router;
  }
}

export { SourceStatusesRoutes };
