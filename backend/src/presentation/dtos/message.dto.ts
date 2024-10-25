import { z } from "zod";

// Input DTO for creating a message
export const createMessageSchema = z.object({
  id: z.string().uuid({
    message: "Invalid id format",
  }),
  content: z
    .string()
    .min(1, {
      message: "Message content cannot be empty",
    })
    .max(1000, {
      message: "Message content too long",
    }),
  sender: z.string().min(1, {
    message: "Sender ID is required",
  }),
  groupId: z.string().uuid({
    message: "Invalid Group Id format",
  }),
});

// Type inference from schema
export type CreateMessageDTO = z.infer<typeof createMessageSchema>;

// Response DTO for messages
export const messageResponseSchema = createMessageSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  status: z.enum(["pending", "processed", "failed"]),
  sentiment: z
    .object({
      score: z.number(),
      label: z.string(),
    })
    .optional(),
});

export type MessageResponseDTO = z.infer<typeof messageResponseSchema>;

// Sentiment analysis DTO
export const sentimentSchema = z.object({
  messageId: z.string().uuid(),
  score: z.number().min(-1).max(1),
  label: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(1),
  aspects: z
    .array(
      z.object({
        aspect: z.string(),
        sentiment: z.enum(["positive", "negative", "neutral"]),
        confidence: z.number().min(0).max(1),
      })
    )
    .optional(),
});

export type SentimentDTO = z.infer<typeof sentimentSchema>;
