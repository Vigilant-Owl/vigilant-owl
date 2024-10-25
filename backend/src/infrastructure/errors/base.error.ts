export class BaseError extends Error {
  constructor(
    public message: string,
    public readonly code: string,
    public readonly status: number,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
