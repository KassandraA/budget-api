import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationHelpers } from './validation-helpers';
import { ValidationTarget } from './validation-target.enum';

export class SourceValidator {
  private static validate = [
    ValidationHelpers.validateString('description'),
    ValidationHelpers.validateString('currency'),
    ValidationHelpers.validateString('note_1'),
    ValidationHelpers.validateString('note_2'),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
      next();
    },
  ];

  static validateOnCreate = [
    ValidationHelpers.validateString('name', ValidationTarget.Body, true, true),
    ValidationHelpers.validateInteger('status_id', ValidationTarget.Body, true),
    ...SourceValidator.validate,
  ];

  static validateOnUpdate = [
    ValidationHelpers.validateString('name', ValidationTarget.Body, false, true),
    ValidationHelpers.validateInteger('status_id'),
    ...SourceValidator.validate,
  ];
}
