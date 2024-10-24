import winston from "winston";
import { BaseError } from "../errors/base.error";

export class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }
  }

  error(error: Error | BaseError, metadata?: Record<string, any>) {
    this.logger.error({
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...(error instanceof BaseError && {
        code: error.code,
        status: error.status,
        metadata: error.metadata,
      }),
      ...metadata,
    });
  }

  info(message: string, metadata?: Record<string, any>) {
    this.logger.info(message, metadata);
  }
}
