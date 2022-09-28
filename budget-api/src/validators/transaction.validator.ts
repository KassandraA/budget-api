import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationHelpers } from './validation-helpers';
import { ValidationTarget } from './validation-target.enum';

export class TransactionValidator {
  private static queryParams = [
    'orderBy',
    'message',
    'transactor',
    'amount',
    'date',
    'tagNames',
    'accountNames',
    'skip',
    'take',
  ];
  private static orderByParams = ['message', 'transactor', 'amount', 'date', 'accountName'];
  private static stringParams = ['like'];
  private static nonStringParams = ['lte', 'gte', 'equal'];

  private static validateQueryKeys = [
    ValidationHelpers.validateObjectKeys(
      null,
      ValidationTarget.Query,
      TransactionValidator.queryParams
    ),
    ValidationHelpers.validateObjectKeys(
      'orderBy',
      ValidationTarget.Query,
      TransactionValidator.orderByParams
    ),
    ValidationHelpers.validateObjectKeys(
      'message',
      ValidationTarget.Query,
      TransactionValidator.stringParams
    ),
    ValidationHelpers.validateObjectKeys(
      'transactor',
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
    ValidationHelpers.validateString('transactor.*', ValidationTarget.Query, false, true),
    ValidationHelpers.validateDecimal('amount.*', ValidationTarget.Query),
    ValidationHelpers.validateDate('date.*', ValidationTarget.Query),
    ValidationHelpers.validateIncludes('orderBy.*', ['ASC', 'DESC'], ValidationTarget.Query),
    ValidationHelpers.validateArray('tagNames', ValidationTarget.Query),
    ValidationHelpers.validateString('tagNames.*', ValidationTarget.Query, false, true),
    ValidationHelpers.validateArray('accountNames', ValidationTarget.Query),
    ValidationHelpers.validateString('accountNames.*', ValidationTarget.Query, false, true),
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
    ValidationHelpers.validateString('*.message'),
    ValidationHelpers.validateString('*.transactor', ValidationTarget.Body, true),
    ValidationHelpers.validateString('*.accountName', ValidationTarget.Body, true),
    ValidationHelpers.validateArray('*.tagNames'),
    ValidationHelpers.validateString('*.tagNames.*'),
    ValidationHelpers.validateArray('*.properties', ValidationTarget.Body, false, false),
    ValidationHelpers.validateString('*.properties.*'),
    TransactionValidator.validate,
  ];

  static validateOnUpdate = [
    ValidationHelpers.validateArray('', ValidationTarget.Body, false, false),
    TransactionValidator.validate,
    ValidationHelpers.validateDate('date'),
    ValidationHelpers.validateDecimal('amount'),
    ValidationHelpers.validateString('message'),
    ValidationHelpers.validateString('transactor'),
    ValidationHelpers.validateString('accountName'),
    ValidationHelpers.validateArray('tagNames'),
    ValidationHelpers.validateString('tagNames.*'),
    ValidationHelpers.validateArray('properties', ValidationTarget.Body, false, false),
    ValidationHelpers.validateString('properties.*'),
    TransactionValidator.validate,
  ];
}
