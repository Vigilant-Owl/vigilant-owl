import { z } from "zod";
import { ValidationError } from "@/infrastructure/errors/application.errors";
import { NextFunction } from "express";

// Message schemas
export const messageSchema = z.object({
  groupId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  sender: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export type MessageInput = z.infer<typeof messageSchema>;

// Validation middleware
export const validateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = await messageSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new ValidationError("Invalid message data", {
          errors: error.errors,
        })
      );
    } else {
      next(error);
    }
  }
};
