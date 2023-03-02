import { Request } from 'express';
import { AccountStatusesService } from '../services/account-statuses.service';
import { AccountStatus } from '../models/account-status.model';
import { AccountStatusesRequestBody } from '../dto/account-statuses-request-body.dto';
import { BaseController } from './abstract/controller.base';
import { TypedRequest, TypedRequestBody, TypedRequestParams, TypedResponse } from '../utils/express/typed-request';

export class AccountStatusesController extends BaseController {
  static getAll(_req: Request, res: TypedResponse<AccountStatus[]>): void {
    AccountStatusesService.getAll()
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static getOneById(
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<AccountStatus>
  ): void {
    AccountStatusesService.getOneById(Number(req.params.id))
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static addOne(
    req: TypedRequestBody<AccountStatusesRequestBody>,
    res: TypedResponse<AccountStatus>
  ): void {
    AccountStatusesService.addOne(req.body.name, req.body.description)
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static updateOne(
    req: TypedRequest<{ id: string }, AccountStatusesRequestBody>,
    res: TypedResponse<AccountStatus>
  ): void {
    AccountStatusesService.updateOne(
      Number(req.params.id),
      req.body.name,
      req.body.description
    )
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static deleteOne(
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<string>
  ): void {
    AccountStatusesService.deleteOne(Number(req.params.id))
      .then((data) => res.json({ message: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }
}
