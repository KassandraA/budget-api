import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationHelpers } from './validation-helpers';
import { ValidationTarget } from './validation-target.enum';

export class AccountValidator {
  private static validate = [
    ValidationHelpers.validateString('description'),
    ValidationHelpers.validateString('currency'),
    ValidationHelpers.validateString('account_number'),
    ValidationHelpers.validateString('card_number'),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
      next();
    }
  ];

  static validateOnCreate = [
    ValidationHelpers.validateString('name', ValidationTarget.Body, true, true),
    ValidationHelpers.validateInteger('status_id', ValidationTarget.Body, true),
    ...AccountValidator.validate
  ];

  static validateOnUpdate = [
    ValidationHelpers.validateString('name', ValidationTarget.Body, false, true),
    ValidationHelpers.validateInteger('status_id'),
    ...AccountValidator.validate
  ];
}
