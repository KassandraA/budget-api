export abstract class StatusCodeError extends Error {
  constructor(message: string) {
    super(message);
  }
  public abstract statusCode: number;
}
