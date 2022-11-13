import { StatusCodeError } from "./status-code.error";

export class NotUniqueError extends StatusCodeError {
  constructor(message: string) {
    super(message);
    this.name = 'NotUniqueError';
  }
  public statusCode = 400;
}
