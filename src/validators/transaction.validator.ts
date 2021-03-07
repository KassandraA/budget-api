import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationHelpers } from './validation-helpers';

export class TransactionValidator {
  private static validateOnCreateOrUpdate = [
    ValidationHelpers.validateString('message'),
    ValidationHelpers.validateString('note_1'),
    ValidationHelpers.validateString('note_2'),
    ValidationHelpers.validateString('note_3'),
    ValidationHelpers.validateArray('tag_ids'),
    ValidationHelpers.validateInteger('tag_ids.*'),
    TransactionValidator.validate,
  ];

  private static validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }

  static validateOnCreate = [
    ValidationHelpers.validateDate('date', true),
    ValidationHelpers.validateDecimal('amount', true),
    ValidationHelpers.validateInteger('source_id', true),
    ...TransactionValidator.validateOnCreateOrUpdate,
  ];

  static validateOnUpdate = [
    ValidationHelpers.validateDate('date'),
    ValidationHelpers.validateDecimal('amount'),
    ValidationHelpers.validateInteger('source_id'),
    ...TransactionValidator.validateOnCreateOrUpdate,
  ];

  // ?
  // static validateOnRetrieve = [
  //   ValidationHelpers.validateRange('orderBy.*', Object.keys(SortDirection), false),
  //   TransactionValidator.validate,
  // ];
}
