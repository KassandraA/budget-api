import { Router } from "express";
import { ParserValidator } from "../validators/parser.validator";
import { ParserController } from "../controllers/parser.controller";

const router = Router();

export class ParserRoutes {
  get routes() {
    router.post('', ParserController.parse);
    return router;
  }
}