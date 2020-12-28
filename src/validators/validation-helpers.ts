import { check, ValidationChain } from 'express-validator';

export class ValidationHelpers {
  static validateString(paramName: string, isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(check(paramName), paramName, isRequired);
    return checker.isString().withMessage(`${paramName} must be a string`).bail();
  }

  static validateInteger(paramName: string, isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(check(paramName), paramName, isRequired);
    return checker.isInt().withMessage(`${paramName} must be an integer`).bail();
  }

  static validateDecimal(paramName: string, isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(check(paramName), paramName, isRequired);
    return checker.isDecimal().withMessage(`${paramName} must be a decimal`).bail();
  }

  static validateDate(paramName: string, isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(check(paramName), paramName, isRequired);
    return checker
      .isDate() // 'YYY/MM/DD' .isDate('format')?
      .withMessage(`${paramName} must be a valid Date`)
      .bail();
  }

  static validateArray(paramName: string, isRequired: boolean = false): ValidationChain {
    const checker = this.validateRequired(check(paramName), paramName, isRequired);
    return checker.isArray().withMessage(`${paramName} must be an array`).bail();
  }

  private static validateRequired(checker: ValidationChain, param: string, required: boolean): ValidationChain {
    return required ? checker.exists().withMessage(`${param} is required`).bail() : checker.optional();
  }
}
