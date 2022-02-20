import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationHelpers } from './validation-helpers';
import { ValidationTarget } from './validation-target.enum';

export class TransactionValidator {
  private static queryParams = [
    'order_by',
    'message',
    'note_1',
    'note_2',
    'note_3',
    'amount',
    'date',
    'tag_names',
    'skip',
    'take',
  ];
  private static orderByParams = ['message', 'note_1', 'note_2', 'note_3', 'amount', 'date'];
  private static stringParams = ['like'];
  private static nonStringParams = ['lte', 'gte', 'equal'];

  private static validateQueryKeys = [
    ValidationHelpers.validateObjectKeys(
      null,
      ValidationTarget.Query,
      TransactionValidator.queryParams
    ),
    ValidationHelpers.validateObjectKeys(
      'order_by',
      ValidationTarget.Query,
      TransactionValidator.orderByParams
    ),
    ValidationHelpers.validateObjectKeys(
      'message',
      ValidationTarget.Query,
      TransactionValidator.stringParams
    ),
    ValidationHelpers.validateObjectKeys(
      'note_1',
      ValidationTarget.Query,
      TransactionValidator.stringParams
    ),
    ValidationHelpers.validateObjectKeys(
      'note_2',
      ValidationTarget.Query,
      TransactionValidator.stringParams
    ),
    ValidationHelpers.validateObjectKeys(
      'note_3',
      ValidationTarget.Query,
      TransactionValidator.stringParams
    ),
    ValidationHelpers.validateObjectKeys(
      'amount',
      ValidationTarget.Query,
      TransactionValidator.nonStringParams
    ),
    ValidationHelpers.validateObjectKeys(
      'date',
      ValidationTarget.Query,
      TransactionValidator.nonStringParams
    ),
    TransactionValidator.validate,
  ];

  private static validateQueryValues = [
    ValidationHelpers.validateString('message.*', ValidationTarget.Query, false, true),
    ValidationHelpers.validateString('note_1.*', ValidationTarget.Query, false, true),
    ValidationHelpers.validateString('note_2.*', ValidationTarget.Query, false, true),
    ValidationHelpers.validateString('note_3.*', ValidationTarget.Query, false, true),
    ValidationHelpers.validateDecimal('amount.*', ValidationTarget.Query),
    ValidationHelpers.validateDate('date.*', ValidationTarget.Query),
    ValidationHelpers.validateIncludes('order_by.*', ['ASC', 'DESC'], ValidationTarget.Query),
    ValidationHelpers.validateArray('tag_names', ValidationTarget.Query),
    ValidationHelpers.validateString('tag_names.*', ValidationTarget.Query),
    ValidationHelpers.validateInteger('skip', ValidationTarget.Query),
    ValidationHelpers.validateInteger('take', ValidationTarget.Query),
    TransactionValidator.validate,
  ];

  private static validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }

  static validateOnGet = [
    ...TransactionValidator.validateQueryKeys,
    ...TransactionValidator.validateQueryValues,
  ];

  static validateOnCreate = [
    ValidationHelpers.validateArray('', ValidationTarget.Body, false, true),
    TransactionValidator.validate,
    ValidationHelpers.validateDate('*.date', ValidationTarget.Body, true),
    ValidationHelpers.validateDecimal('*.amount', ValidationTarget.Body, true),
    ValidationHelpers.validateString('*.account_name', ValidationTarget.Body, true),
    ValidationHelpers.validateString('*.message'),
    ValidationHelpers.validateString('*.note_1'),
    ValidationHelpers.validateString('*.note_2'),
    ValidationHelpers.validateString('*.note_3'),
    ValidationHelpers.validateArray('*.tag_names'),
    ValidationHelpers.validateString('*.tag_names.*'),
    TransactionValidator.validate,
  ];

  static validateOnUpdate = [
    ValidationHelpers.validateArray('', ValidationTarget.Body, false, false),
    TransactionValidator.validate,
    ValidationHelpers.validateDate('date'),
    ValidationHelpers.validateDecimal('amount'),
    ValidationHelpers.validateString('account_name'),
    ValidationHelpers.validateString('message'),
    ValidationHelpers.validateString('note_1'),
    ValidationHelpers.validateString('note_2'),
    ValidationHelpers.validateString('note_3'),
    ValidationHelpers.validateArray('tag_names'),
    ValidationHelpers.validateString('tag_names.*'),
    TransactionValidator.validate,
  ];
}
