import { BaseError } from "./base.error";

export class ValidationError extends BaseError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", 400, metadata);
  }
}

export class NotFoundError extends BaseError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, "NOT_FOUND", 404, {
      resource,
      id,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(message, "UNAUTHORIZED", 401);
  }
}
