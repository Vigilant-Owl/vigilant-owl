import { Request, Response } from "express";
import processMessageUseCase, {
  ProcessMessageUseCase,
} from "@/application/use-cases/process-message.use-case";

export class MessageController {
  constructor(private processMessageUseCase: ProcessMessageUseCase) {}

  async processMessage(req: Request, res: Response) {
    try {
      const message = await this.processMessageUseCase.execute({
        id: req.body.id,
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

const messageController = new MessageController(processMessageUseCase);
export default messageController;
