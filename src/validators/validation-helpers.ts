import { body, ValidationChain } from 'express-validator';

export class ValidationHelpers {
  static validateString(paramName: string, isRequired: boolean = false, isNotEmpty: boolean = false): ValidationChain {
    const checker = this.validateRequired(body(paramName), paramName, isRequired);
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
    const checker = this.validateRequired(body(paramName), paramName, isRequired);
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
    const checker = this.validateRequired(body(paramName), paramName, isRequired);
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
    const checker = this.validateRequired(body(paramName), paramName, isRequired);
    return checker.isISO8601({ strict: true }).withMessage(`${paramName} must be a valid Date`).bail();
  }

  static validateArray(paramName: string, isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(body(paramName), paramName, isRequired);
    return checker.isArray().withMessage(`${paramName} must be an array`).bail();
  }

  static validateRange(paramName: string, paramValues: string[], isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(body(paramName), paramName, isRequired);
    return checker.isIn(paramValues).withMessage(`${paramName} must be one of ${paramValues}`).bail();
  }

  private static validateRequired(checker: ValidationChain, param: string, required: boolean): ValidationChain {
    return required ? checker.exists().withMessage(`${param} is required`).bail() : checker.optional();
  }
}
