import { Message } from "@/domain/entities/message.entity";

export interface IMessageRepository {
  create(message: CreateMessageDTO): Promise<Message>;
  findById(id: string): Promise<Message | null>;
  updateSentiment(id: string, sentiment: SentimentDTO): Promise<Message>;
  findByGroupId(groupId: string): Promise<Message[]>;
}
