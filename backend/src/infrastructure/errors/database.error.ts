import { BaseError } from "./base.error";

export class DatabaseError extends BaseError {
  constructor(
    message: string,
    code: string = "DATABASE_ERROR",
    metadata?: Record<string, any>
  ) {
    super(message, code, 400, metadata);
  }

  static createError(
    operation: string,
    originalError?: unknown
  ): DatabaseError {
    let message = `Database error during ${operation}`;
    let code = "DATABASE_ERROR";

    // Handle Supabase specific errors
    if (
      originalError &&
      typeof originalError === "object" &&
      "code" in originalError
    ) {
      switch ((originalError as { code: string }).code) {
        case "23505": // unique violation
          code = "UNIQUE_VIOLATION";
          message = `Duplicate entry found during ${operation}`;
          break;
        case "23503": // foreign key violation
          code = "FOREIGN_KEY_VIOLATION";
          message = `Referenced record not found during ${operation}`;
          break;
        case "42P01": // undefined table
          code = "TABLE_NOT_FOUND";
          message = `Table not found during ${operation}`;
          break;
      }
    }

    return new DatabaseError(message, code);
  }
}
