import { BaseError } from "./base.error";

export class ValidationError extends BaseError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", 400, metadata);
  }
}
