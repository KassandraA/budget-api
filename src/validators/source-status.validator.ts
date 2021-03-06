import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationHelpers } from './validation-helpers';

export class SourceStatusValidator {
  private static validate = [
    ValidationHelpers.validateString('description'),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
      next();
    },
  ];

  static validateOnCreate = [ValidationHelpers.validateString('name', true, true), ...SourceStatusValidator.validate];

  static validateOnUpdate = [ValidationHelpers.validateString('name', false, true), ...SourceStatusValidator.validate];
}
