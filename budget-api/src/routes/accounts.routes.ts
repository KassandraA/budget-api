import { Router } from "express";
import { AccountValidator } from "../validators/account.validator";
import { AccountsController } from "../controllers/accounts.controller";
import {
  TypedRequest,
  TypedRequestBody,
  TypedRequestParams,
  TypedResponse
} from "../utils/express/typed-request";
import { Account } from "../models/account.model";
import { AccountsRequestBody } from "../dto/accounts-request-body.dto";

const router = Router();

export class AccountsRoutes {
  get routes() {
    router.get("", (req, res) => AccountsController.getAll(req, res));

    router.get(
      "/:id([0-9]+)",
      (
        req: TypedRequestParams<{ id: string }>,
        res: TypedResponse<Account>
      ) => AccountsController.getOneById(req, res)
    );

    router.post(
      "",
      AccountValidator.validateOnCreate,
      (
        req: TypedRequestBody<AccountsRequestBody>,
        res: TypedResponse<Account>
      ) => AccountsController.addOne(req, res)
    );

    router.patch(
      "/:id([0-9]+)",
      AccountValidator.validateOnUpdate,
      (
        req: TypedRequest<{ id: string }, AccountsRequestBody>,
        res: TypedResponse<Account>
      ) => AccountsController.updateOne(req, res)
    );

    router.delete(
      "/:id([0-9]+)",
      (
        req: TypedRequestParams<{ id: string }>,
        res: TypedResponse<string>
      ) => AccountsController.deleteOne(req, res)
    );

    return router;
  }
}
