import { body, query, ValidationChain } from 'express-validator';
import { ValidationTarget } from './validation-target.enum';

export class ValidationHelpers {
  static validateString(
    paramName: string,
    target: ValidationTarget = ValidationTarget.Body,
    isRequired: boolean = false,
    isNotEmpty: boolean = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker
      .not()
      .isArray()
      .withMessage(`${paramName} must not be an array`)
      .bail()
      .isString()
      .withMessage(`${paramName} must be a string`)
      .bail()
      .if(() => isNotEmpty)
      .notEmpty()
      .withMessage(`${paramName} must not be empty`)
      .bail();
  }

  static validateInteger(
    paramName: string,
    target: ValidationTarget = ValidationTarget.Body,
    isRequired: boolean = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker
      .not()
      .isArray()
      .withMessage(`${paramName} must not be an array`)
      .bail()
      .isInt()
      .withMessage(`${paramName} must be an integer`)
      .bail()
      .toInt();
  }

  static validateDecimal(
    paramName: string,
    target: ValidationTarget = ValidationTarget.Body,
    isRequired: boolean = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker
      .not()
      .isArray()
      .withMessage(`${paramName} must not be an array`)
      .bail()
      .isDecimal()
      .withMessage(`${paramName} must be a decimal`)
      .bail()
      .toFloat();
  }

  static validateDate(
    paramName: string,
    target: ValidationTarget = ValidationTarget.Body,
    isRequired: boolean = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker
      .isISO8601({ strict: true })
      .withMessage(`${paramName} must be a valid Date`)
      .bail()
      .toDate();
  }

  static validateArray(
    paramName: string,
    target: ValidationTarget = ValidationTarget.Body,
    isRequired: boolean = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker.isArray().withMessage(`${paramName} must be an array`).bail();
  }

  static validateArrayBody(): ValidationChain {
    const checker = this.validateRequired(body(), '', true);
    return checker.isArray().withMessage(`Body must be an array`).bail();
  }

  static validateIncludes(
    paramName: string,
    values: string[],
    target: ValidationTarget = ValidationTarget.Body,
    isRequired: boolean = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker
      .isIn(values)
      .withMessage(`${paramName} must be in ${values.join(', ')}`)
      .bail();
  }

  static validateObjectKeys(
    paramName: string,
    target: ValidationTarget,
    keys: string[]
  ): ValidationChain {
    return this.getChecker(target, paramName).custom((value) => {
      if (!value) return true;

      const currKeys = Object.keys(value);
      const invalidKeys = currKeys.filter((k) => !keys.includes(k));
      if (invalidKeys.length > 0) {
        throw new Error(
          `${target.toString()}${paramName ? '.' + paramName : ''} ` +
            `contains invalid keys: '${invalidKeys.join("', '")}'. ` +
            `Allowed keys: '${keys.join("', '")}'`
        );
      }
      return true;
    });
  }

  private static validateRequired(
    checker: ValidationChain,
    param: string,
    required: boolean
  ): ValidationChain {
    return required
      ? checker.exists().withMessage(`${param} is required`).bail()
      : checker.optional();
  }

  private static getChecker(target: ValidationTarget, paramName: string = ''): ValidationChain {
    switch (target) {
      case ValidationTarget.Query:
        return paramName ? query(paramName) : query();
      case ValidationTarget.Body:
      default:
        return paramName ? body(paramName) : body();
    }
  }
}
