import { BaseError } from "./base.error";

export class NotFoundError extends BaseError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, "NOT_FOUND", 404, {
      resource,
      id,
    });
  }
}
