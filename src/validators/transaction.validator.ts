import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationHelpers } from './validation-helpers';

export class TransactionValidator {
  private static validate = [
    ValidationHelpers.validateString('message'),
    ValidationHelpers.validateString('note_1'),
    ValidationHelpers.validateString('note_2'),
    ValidationHelpers.validateString('note_3'),
    ValidationHelpers.validateArray('tags'),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
      next();
    },
  ];

  static validateOnCreate = [
    ValidationHelpers.validateDate('date', true),
    ValidationHelpers.validateInteger('amount', true),
    ValidationHelpers.validateInteger('source_id', true), //check
    ...TransactionValidator.validate,
  ];

  static validateOnUpdate = [
    ValidationHelpers.validateDate('date'),
    ValidationHelpers.validateInteger('amount'),
    ValidationHelpers.validateInteger('source_id'),
    ...TransactionValidator.validate,
  ];
}
