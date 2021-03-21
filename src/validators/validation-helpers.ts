import { body, query, ValidationChain } from 'express-validator';
import { ValidationTarget } from './validation-target.enum';

export class ValidationHelpers {
  static validateString(
    paramName: string,
    isRequired: boolean = false,
    isNotEmpty: boolean = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(ValidationTarget.Body, paramName),
      // todo: add ValidationTarget.Body/Query as parameter to all validators
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

  static validateInteger(paramName: string, isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(ValidationTarget.Body, paramName),
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

  static validateDecimal(paramName: string, isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(ValidationTarget.Body, paramName),
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

  static validateDate(paramName: string, isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(ValidationTarget.Body, paramName),
      paramName,
      isRequired
    );
    return checker
      .isISO8601({ strict: true })
      .withMessage(`${paramName} must be a valid Date`)
      .bail();
  }

  static validateArray(paramName: string, isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(ValidationTarget.Body, paramName),
      paramName,
      isRequired
    );
    return checker.isArray().withMessage(`${paramName} must be an array`).bail();
  }

  static validateQueryKeys(paramName: string, queryKeys: string[]): ValidationChain {
    return this.getChecker(ValidationTarget.Query, paramName).custom((value) => {
      if (value && Object.keys(value).some((k) => !queryKeys.includes(k))) {
        throw new Error(
          `The query${paramName ? '.' + paramName : ''} param may contain only ${queryKeys.join(
            ', '
          )}`
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
