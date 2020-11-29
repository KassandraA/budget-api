export class RemovalRestrictedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RemovalRestrictedError';
  }
  public statusCode = 400;
}
