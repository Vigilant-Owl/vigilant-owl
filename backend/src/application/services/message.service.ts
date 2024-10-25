import { Message } from "@/domain/entities/message.entity";
import { IMessageRepository } from "../interfaces/repositories/message-repository.interface";
import { ISentimentAnalysisService } from "../interfaces/services/sentiment-analysis.interface";
import { CreateMessageDTO } from "@/presentation/dtos/message.dto";
import messageRepository from "@/infrastructure/supabase/repositories/message.repository";

export class MessageService {
  constructor(
    private messageRepository: IMessageRepository,
    private sentimentService: ISentimentAnalysisService
  ) {}

  async processMessage(messageData: CreateMessageDTO): Promise<Message> {
    // Create message
    const message = await this.messageRepository.create(messageData);

    // Analyze sentiment
    const sentiment = await this.sentimentService.analyzeSentiment(
      message.content
    );

    // Update message with sentiment
    return this.messageRepository.updateSentiment(message.id, sentiment);
  }
}

const messageService = new MessageService(messageRepository, null);
export default messageService;