import { Router } from "express";
import { TagValidator } from "../validators/tag.validator";
import { TagsController } from "../controllers/tags.controller";
import {
  TypedRequest,
  TypedRequestBody,
  TypedRequestParams,
  TypedResponse
} from "../utils/express/typed-request";
import { Tag } from "../models/tag.model";
import { TagsRequestBody } from "../dto/tags-request-body.dto";

const router = Router();

export class TagsRoutes {
  get routes() {
    router.get("", (req, res) => TagsController.getAll(req, res));

    router.get(
      "/:id([0-9]+)",
      (
        req: TypedRequestParams<{ id: string }>,
        res: TypedResponse<Tag>
      ) => TagsController.getOneById(req, res)
    );

    router.post(
      "",
      TagValidator.validateOnCreateOrUpdate,
      (
        req: TypedRequestBody<TagsRequestBody>,
        res: TypedResponse<Tag>
      ) => TagsController.addOne(req, res)
    );

    router.patch(
      "/:id([0-9]+)",
      TagValidator.validateOnCreateOrUpdate,
      (
        req: TypedRequest<{ id: string }, TagsRequestBody>,
        res: TypedResponse<Tag>
      ) => TagsController.updateOne(req, res)
    );

    router.delete("/:id([0-9]+)", 
      (
        req: TypedRequestParams<{ id: string }>,
        res: TypedResponse<string>
      ) => TagsController.deleteOne(req, res)
    );
    
    return router;
  }
}
