import { Request, Response } from "express";
import { ProcessMessageUseCase } from "@/application/use-cases/process-message.use-case";

export class MessagesController {
  constructor(private processMessageUseCase: ProcessMessageUseCase) {}

  async processMessage(req: Request, res: Response) {
    try {
      const message = await this.processMessageUseCase.execute({
        groupId: req.body.groupId,
        content: req.body.content,
        sender: req.body.sender,
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to process message" });
    }
  }
}
