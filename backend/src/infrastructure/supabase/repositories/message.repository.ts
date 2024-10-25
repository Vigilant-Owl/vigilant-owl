import { SupabaseClient } from "@supabase/supabase-js";
import { IMessageRepository } from "@/application/interfaces/repositories/message-repository.interface";
import { Message } from "@/domain/entities/message.entity";
import { MessageMapper } from "../mappers/message.mapper";
import { DatabaseError } from "@/infrastructure/errors/database.error";
import { supabaseClient } from "@/config/supabase";
import {
  CreateMessageDTO,
  SentimentDTO,
} from "@/presentation/dtos/message.dto";

export class SupabaseMessageRepository implements IMessageRepository {
  private supabase: SupabaseClient;
  private mapper: MessageMapper;

  constructor() {
    this.supabase = supabaseClient;
    this.mapper = new MessageMapper();
  }

  async create(messageDto: CreateMessageDTO): Promise<Message> {
    const { data, error } = await this.supabase
      .from("messages")
      .insert(this.mapper.toDatabase(messageDto as Message))
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return this.mapper.toDomain(data);
  }

  async findById(id: string): Promise<Message | null> {
    const { data, error } = await this.supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error.message);
    return data ? this.mapper.toDomain(data) : null;
  }

  async updateSentiment(id: string, sentiment: SentimentDTO): Promise<Message> {
    const { data, error } = await this.supabase
      .from("messages")
      .update({ sentiment })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return this.mapper.toDomain(data);
  }

  async findByGroupId(groupId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from("messages")
      .select("*")
      .eq("group-id", groupId)
      .single();
    if (error) throw new DatabaseError(error.message);
    return this.mapper.toDatabase(data);
  }
}

const messageRepository = new SupabaseMessageRepository();

export default messageRepository;
