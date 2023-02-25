import { Request } from 'express';
import { TagsService } from '../services/tags.service';
import { Tag } from '../models/tag.model';
import { TagsRequestBody } from '../dto/tags-request-body.dto';
import { BaseController } from './abstract/controller.base';
import { TypedRequest, TypedRequestBody, TypedRequestParams, TypedResponse } from '../utils/express/typed-request';

export class TagsController {
  static getAll(_req: Request, res: TypedResponse<Tag[]>): void {
    TagsService.getAll()
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static getOneById(
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<Tag>
  ): void {
    TagsService.getOneById(Number(req.params.id))
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static addOne(
    req: TypedRequestBody<TagsRequestBody>,
    res: TypedResponse<Tag>
  ): void {
    TagsService.addOne(req.body.name)
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static updateOne(
    req: TypedRequest<{ id: string }, TagsRequestBody>,
    res: TypedResponse<Tag>
  ): void {
    TagsService.updateOne(Number(req.params.id), req.body.name )
      .then((data) => res.json({ data: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }

  static deleteOne(
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<string>
  ): void {
    TagsService.deleteOne(Number(req.params.id))
      .then((data) => res.json({ message: data }))
      .catch((error) => BaseController.writeErrorToResponse(error, res));
  }
}
