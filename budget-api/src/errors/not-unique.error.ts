export class NotUniqueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotUniqueError';
  }
  public statusCode = 400;
}
