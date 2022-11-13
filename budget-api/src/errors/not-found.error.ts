import { StatusCodeError } from "./status-code.error";

export class NotFoundError extends StatusCodeError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
  public statusCode = 404;
}
