import { Request, Response, NextFunction } from "express";
import { BaseError } from "@/infrastructure/errors/base.error";
import { Logger } from "@/infrastructure/logger/logger.service";

export function errorHandler(logger: Logger) {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(error, {
      path: req.path,
      method: req.method,
      query: req.query,
      body: req.body,
    });

    if (error instanceof BaseError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        metadata: error.metadata,
      });
    }

    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    });
  };
}
