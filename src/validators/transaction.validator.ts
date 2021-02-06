import { NextFunction, Request, Response } from 'express';
import { body, check, ValidationChain, validationResult } from 'express-validator';
import { Transaction } from '../models/transaction.model';
import { SortDirection } from '../dto/filter-sort-page.dto';
import { ValidationHelpers } from './validation-helpers';

export class TransactionValidator {
  private static validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }

  private static validateOnCreateOrUpdate = [
    ValidationHelpers.validateString('message'),
    ValidationHelpers.validateString('note_1'),
    ValidationHelpers.validateString('note_2'),
    ValidationHelpers.validateString('note_3'),
    ValidationHelpers.validateArray('tag_ids'),
    // check('tag_ids.*').isInt().withMessage(`Tags must be an array of numbers`).bail(), // Todo: check
    ValidationHelpers.validateInteger('tag_ids.*'),
    TransactionValidator.validate,
  ];

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

  static validateOnRetrieve = [
    ValidationHelpers.validateRange('orderBy.*', Object.keys(SortDirection), false),
    TransactionValidator.validate,
  ];
}
