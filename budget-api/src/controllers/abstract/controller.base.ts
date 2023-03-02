import { StatusCodeError } from '../../errors/status-code.error';
import { TypedResponse } from '../../utils/express/typed-request';

export abstract class BaseController {
  static writeErrorToResponse<TResponseData>(error: unknown, response: TypedResponse<TResponseData>) {
    const name = error instanceof Error ? error.name : 'Error';
    const message = error instanceof Error ? error.message : String(error);
    const errorCode = error instanceof StatusCodeError ? error.statusCode : 500;
    response.status(errorCode).json({ error: name, message: message });
  }
}