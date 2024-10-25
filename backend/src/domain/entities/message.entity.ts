export class Message {
  constructor(
    public id: string,
    public content: string,
    public groupId: string,
    public sender: string,
    public sentiment?: SentimentAnalysis,
    public createdAt: Date = new Date()
  ) {}

  // Domain business rules/behavior
  public updateSentiment(sentiment: SentimentAnalysis): void {
    this.sentiment = sentiment;
  }

  public isProcessed(): boolean {
    return !!this.sentiment;
  }
}
