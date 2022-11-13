import { body, query, ValidationChain } from 'express-validator';
import { KeyValueType } from '../dto/transaction-filter-sort-page.dto';
import { ValidationTarget } from './validation-target.enum';

export class ValidationHelpers {
  static validateString(
    paramName: string,
    target: ValidationTarget = ValidationTarget.Body,
    isRequired = false,
    isNotEmpty = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker
      .not()
      .isArray()
      .withMessage(`${this.beautifyParam(paramName)} must not be an array`)
      .bail()
      .isString()
      .withMessage(`${this.beautifyParam(paramName)} must be a string`)
      .bail()
      .if(() => isNotEmpty)
      .notEmpty()
      .withMessage(`${this.beautifyParam(paramName)} must not be empty`)
      .bail();
  }

  static validateInteger(
    paramName: string,
    target: ValidationTarget = ValidationTarget.Body,
    isRequired = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker
      .not()
      .isArray()
      .withMessage(`${this.beautifyParam(paramName)} must not be an array`)
      .bail()
      .isInt()
      .withMessage(`${this.beautifyParam(paramName)} must be an integer`)
      .bail()
      .toInt();
  }

  static validateDecimal(
    paramName: string,
    target: ValidationTarget = ValidationTarget.Body,
    isRequired = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker
      .not()
      .isArray()
      .withMessage(`${this.beautifyParam(paramName)} must not be an array`)
      .bail()
      .isDecimal()
      .withMessage(`${this.beautifyParam(paramName)} must be a decimal`)
      .bail()
      .toFloat();
  }

  static validateDate(
    paramName: string,
    target: ValidationTarget = ValidationTarget.Body,
    isRequired = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker
      .isISO8601({ strict: true })
      .withMessage(`${this.beautifyParam(paramName)} must be a valid Date`)
      .bail()
      .toDate();
  }

  static validateArray(
    paramName: string,
    target: ValidationTarget = ValidationTarget.Body,
    isRequired = false,
    mustBeArray = true
  ): ValidationChain {
    const param = paramName.length ? this.beautifyParam(paramName) : target;
    let checker = this.validateRequired(
      this.getChecker(target, paramName),
      param,
      isRequired
    );
    checker = mustBeArray ? checker : checker.not();
    return checker
      .isArray()
      .withMessage(`${param} must${mustBeArray ? ' ' : ' not '}be an array`)
      .bail();
  }

  static validateIncludes(
    paramName: string,
    values: string[],
    target: ValidationTarget = ValidationTarget.Body,
    isRequired = false
  ): ValidationChain {
    const checker = this.validateRequired(
      this.getChecker(target, paramName),
      paramName,
      isRequired
    );
    return checker
      .isIn(values)
      .withMessage(`${this.beautifyParam(paramName)} must be in ${values.join(', ')}`)
      .bail();
  }

  static validateObjectKeys(
    paramName: string,
    target: ValidationTarget,
    keys: string[]
  ): ValidationChain {
    return this.getChecker(target, paramName).custom((value: KeyValueType) => { // Unsafe argument of type `any` assigned to a parameter of type `{}`  @typescript-eslint/no-unsafe-argument
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
      ? checker
          .exists()
          .withMessage(`${this.beautifyParam(param)} is required`)
          .bail()
      : checker.optional();
  }

  private static getChecker(target: ValidationTarget, paramName = ''): ValidationChain {
    switch (target) {
      case ValidationTarget.Query:
        return paramName ? query(paramName) : query();
      case ValidationTarget.Body:
      default:
        return paramName ? body(paramName) : body();
    }
  }

  private static beautifyParam(param: string): string {
    return param.replace(/[^\w\s]/gi, '');
  }
}
