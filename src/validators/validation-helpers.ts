import { check, ValidationChain } from 'express-validator';

export class ValidationHelpers {
  static validateString(paramName: string, isRequired: boolean = false): ValidationChain {
    // todo: refactor start:
    let checker = check(paramName);
    if (isRequired) {
      checker = checker.exists().withMessage(`${paramName} required`).bail();
    } else {
      checker = checker.optional();
    }
    // todo: refactor end.
    return checker.isString().withMessage(`${paramName} must be a string`).bail();
    // .notEmpty()
    // .withMessage(`${paramName} cannot be empty`)
    // .bail();
  }

  static validateNumber(paramName: string, isRequired: boolean = false): ValidationChain {
    let checker = check(paramName);
    if (isRequired) {
      checker = checker.exists().withMessage(`${paramName} required`).bail();
    } else {
      checker = checker.optional();
    }
    return checker
      .exists()
      .withMessage(`${paramName} required`)
      .bail()
      .isInt()
      .withMessage(`${paramName} must be an integer`)
      .bail();
  }

  static validateDate(paramName: string, isRequired: boolean = false): ValidationChain {
    let checker = check(paramName);
    if (isRequired) {
      checker = checker.exists().withMessage(`${paramName} required`).bail();
    } else {
      checker = checker.optional();
    }
    return checker
      .exists()
      .withMessage(`${paramName} required`)
      .bail()
      .isDate() // 'YYY/MM/DD' .isDate('format')?
      .withMessage(`${paramName} must be a valid Date`)
      .bail();
  }

  static validateArray(paramName: string, isRequired: boolean = false): ValidationChain {
    let checker = check(paramName);
    if (isRequired) {
      checker = checker.exists().withMessage(`${paramName} required`).bail();
    } else {
      checker = checker.optional();
    }
    return checker
      .exists()
      .withMessage(`${paramName} required`)
      .bail()
      .isArray()
      .withMessage(`${paramName} must be an array`)
      .bail();
  }
}
