import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

export class SourceValidator {
  static validateSource = [
    check('name')
      .exists()
      .withMessage('name required')
      .bail()
      .isString()
      .withMessage('name must be a string')
      .bail()
      .notEmpty()
      .withMessage('name cannot be empty')
      .bail(),
    check('status_id')
      .exists()
      .withMessage('status_id required')
      .isInt()
      .withMessage('status_id must be an integer')
      .bail(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
      next();
    },
  ];
}
