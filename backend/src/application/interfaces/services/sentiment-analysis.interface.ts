export interface ISentimentAnalysisService {
  analyzeSentiment(text: string): Promise<SentimentResult>;
  batchAnalyze(texts: string[]): Promise<SentimentResult[]>;
}
