export class MessageMapper {
  toDomain(raw: any): Message {
    return new Message(
      raw.id,
      raw.content,
      raw.group_id,
      raw.sender,
      raw.sentiment,
      new Date(raw.created_at)
    );
  }

  toDatabase(message: Message): any {
    return {
      content: message.content,
      group_id: message.groupId,
      sender: message.sender,
      sentiment: message.sentiment,
      created_at: message.createdAt.toISOString(),
    };
  }
}
