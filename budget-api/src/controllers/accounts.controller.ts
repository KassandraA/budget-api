import { Request } from 'express';
import { AccountsService } from '../services/accounts.service';
import { Account } from '../models/account.model';
import { AccountsRequestBody } from '../dto/accounts-request-body.dto';
import { TypedRequest, TypedRequestBody, TypedRequestParams, TypedResponse } from '../utils/express/typed-request';
import { BaseController } from './abstract/controller.base';

export class AccountsController {
  static getAll(_req: Request, res: TypedResponse<Account[]>): void {
    AccountsService.getAll()
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static getOneById(
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<Account>
  ): void {
    AccountsService.getOneById(Number(req.params.id))
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static addOne(
    req: TypedRequestBody<AccountsRequestBody>,
    res: TypedResponse<Account>
  ): void {
    AccountsService.addOne(
      req.body.name,
      req.body.status_id,
      req.body.description,
      req.body.currency,
      req.body.account_number,
      req.body.card_number
    )
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static updateOne(
    req: TypedRequest<{ id: string }, AccountsRequestBody>,
    res: TypedResponse<Account>
  ): void {
    AccountsService.updateOne(
      Number(req.params.id),
      req.body.name,
      req.body.status_id,
      req.body.description,
      req.body.currency,
      req.body.account_number,
      req.body.card_number
    )
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static deleteOne(
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<string>
  ): void {
    AccountsService.deleteOne(Number(req.params.id))
      .then((data) => res.json({ message: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }
}
