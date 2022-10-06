import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationHelpers } from './validation-helpers';
import { ValidationTarget } from './validation-target.enum';

export class AccountStatusValidator {
  private static validate = [
    ValidationHelpers.validateString('description'),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
      next();
    }
  ];

  static validateOnCreate = [
    ValidationHelpers.validateString('name', ValidationTarget.Body, true, true),
    ...AccountStatusValidator.validate
  ];

  static validateOnUpdate = [
    ValidationHelpers.validateString('name', ValidationTarget.Body, false, true),
    ...AccountStatusValidator.validate
  ];
}
