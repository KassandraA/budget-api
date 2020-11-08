import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ValidationHelpers } from './validation-helpers';

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
    ValidationHelpers.validateString('name', true),
    ValidationHelpers.validateNumber('status_id', true),
    ...SourceValidator.validate,
  ];

  static validateOnUpdate = [
    ValidationHelpers.validateString('name'),
    ValidationHelpers.validateNumber('status_id'),
    ...SourceValidator.validate,
  ];
}
