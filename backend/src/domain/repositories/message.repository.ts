import { Message } from "../entities/message.entity";

// Core business rules and repository contract
export interface MessageRepository {
  save(message: Message): Promise<void>;
  findById(id: string): Promise<Message | null>;
  update(message: Message): Promise<void>;
}
