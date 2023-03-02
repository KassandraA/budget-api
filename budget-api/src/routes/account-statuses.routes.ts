import { Router } from "express";
import { AccountStatusValidator } from "../validators/account-status.validator";
import { AccountStatusesController } from "../controllers/account-statuses.controller";
import {
  TypedRequest,
  TypedRequestBody,
  TypedRequestParams,
  TypedResponse
} from "../utils/express/typed-request";
import { AccountStatusesRequestBody } from "../dto/account-statuses-request-body.dto";
import { AccountStatus } from "../models/account-status.model";

const router = Router();

export class AccountStatusesRoutes {
  get routes() {
    router.get("", (req, res) => AccountStatusesController.getAll(req, res));

    router.get(
      "/:id([0-9]+)",
      (
        req: TypedRequestParams<{ id: string }>,
        res: TypedResponse<AccountStatus>
      ) => AccountStatusesController.getOneById(req, res)
    );

    router.post(
      "",
      AccountStatusValidator.validateOnCreate,
      (
        req: TypedRequestBody<AccountStatusesRequestBody>,
        res: TypedResponse<AccountStatus>
      ) => AccountStatusesController.addOne(req, res)
    );

    router.patch(
      "/:id([0-9]+)",
      AccountStatusValidator.validateOnUpdate,
      (
        req: TypedRequest<{ id: string }, AccountStatusesRequestBody>,
        res: TypedResponse<AccountStatus>
      ) => AccountStatusesController.updateOne(req, res)
    );

    router.delete(
      "/:id([0-9]+)",
      (
        req: TypedRequestParams<{ id: string }>,
        res: TypedResponse<string>
      ) => AccountStatusesController.deleteOne(req, res)
    );
    
    return router;
  }
}
