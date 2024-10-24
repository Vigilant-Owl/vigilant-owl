import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { IMessageRepository } from "@/application/interfaces/repositories/message-repository.interface";
import { Message } from "@/domain/entities/message.entity";
import { MessageMapper } from "./message.mapper";

export class SupabaseMessageRepository implements IMessageRepository {
  private supabase: SupabaseClient;
  private mapper: MessageMapper;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
    this.mapper = new MessageMapper();
  }

  async create(messageDto: CreateMessageDTO): Promise<Message> {
    const { data, error } = await this.supabase
      .from("messages")
      .insert(this.mapper.toDatabase(messageDto))
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
}
