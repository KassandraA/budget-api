import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from 'express-validator';

export class ParserValidator {
  static validate = [
    this.validateString,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
      next();
    },
  ]

  private static validateString(
    paramName: string
  ): ValidationChain {
    return body()
      .not()
      .isArray()
      .withMessage(`${paramName} must not be an array`)
      .bail()
      .isString()
      .withMessage(`${paramName} must be a string`)
      .bail()
      .notEmpty()
      .withMessage(`${paramName} must not be empty`)
      .bail();
  }
}