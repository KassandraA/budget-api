export abstract class StatusCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StatusCodeError';
  }
  public abstract statusCode: number;
}
