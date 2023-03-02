import { StatusCodeError } from "./status-code.error";

export class InvalidParamsError extends StatusCodeError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidParamsError';
  }
  public statusCode = 400;
}
