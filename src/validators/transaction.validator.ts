import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationHelpers } from './validation-helpers';

export class TransactionValidator {
  private static queryParams = [
    'order_by',
    'message',
    'note_1',
    'note_2',
    'note_3',
    'amount',
    'date',
    'skip',
    'take',
  ];
  private static orderByParams = ['message', 'note_1', 'note_2', 'note_3', 'amount', 'date'];
  private static stringParams = ['like'];
  private static nonStringParams = ['lte', 'gte', 'equal'];

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

  static validateQueryKeys = [
    ValidationHelpers.validateQueryKeys(null, TransactionValidator.queryParams),
    ValidationHelpers.validateQueryKeys('order_by', TransactionValidator.orderByParams),
    ValidationHelpers.validateQueryKeys('message', TransactionValidator.stringParams),
    ValidationHelpers.validateQueryKeys('note_1', TransactionValidator.stringParams),
    ValidationHelpers.validateQueryKeys('note_2', TransactionValidator.stringParams),
    ValidationHelpers.validateQueryKeys('note_3', TransactionValidator.stringParams),
    ValidationHelpers.validateQueryKeys('amount', TransactionValidator.nonStringParams),
    ValidationHelpers.validateQueryKeys('date', TransactionValidator.nonStringParams),
    // ValidationHelpers.validateInteger('skip'),
    // ValidationHelpers.validateInteger('take'),
    // todo: add ValidationTarget.Body/Query as parameter to all validators AND
    // todo: add validator to query values
    TransactionValidator.validate,
  ];
}
