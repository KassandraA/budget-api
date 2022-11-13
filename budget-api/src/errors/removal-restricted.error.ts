import { StatusCodeError } from "./status-code.error";

export class RemovalRestrictedError extends StatusCodeError {
  constructor(message: string) {
    super(message);
    this.name = 'RemovalRestrictedError';
  }
  public statusCode = 400;
}
