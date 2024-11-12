const OpenAI = require("openai");
const supabase = require("../config/supabase");

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const SYSTEM_PROMPT = {
  toneAnalysis: `You are an advanced linguistic and psychological analysis expert. Analyze the following message and provide a detailed assessment in JSON format. Consider:

1. Emotional indicators
2. Communication style
3. Psychological markers
4. Social dynamics

Provide a JSON response with the following structure:
{
  "primaryEmotion": string,
  "secondaryEmotions": string[],
  "intensity": number (1-10),
  "formality": number (1-10),
  "sentiment": "positive" | "neutral" | "negative",
  "communicationStyle": {
    "assertiveness": number (1-10),
    "openness": number (1-10),
    "engagement": number (1-10)
  },
  "psychologicalIndicators": {
    "stress": number (1-10),
    "confidence": number (1-10),
    "anxiety": number (1-10)
  },
  "socialDynamics": {
    "cooperation": number (1-10),
    "dominance": number (1-10),
    "empathy": number (1-10)
  },
  "contentTags": string[]
}`,
};

const generateFallbackAnalysis = (error) => ({
  primaryEmotion: "unknown",
  secondaryEmotions: [],
  intensity: 5,
  formality: 5,
  sentiment: "neutral",
  communicationStyle: {
    assertiveness: 5,
    openness: 5,
    engagement: 5,
  },
  psychologicalIndicators: {
    stress: 5,
    confidence: 5,
    anxiety: 5,
  },
  socialDynamics: {
    cooperation: 5,
    dominance: 5,
    empathy: 5,
  },
  contentTags: [],
  error: error.message,
});

global.ai = {};
global.ai.analyzeTone = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT.toneAnalysis,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.4,
      max_tokens: 500,
      // response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error in tone analysis:", error);
    return generateFallbackAnalysis(error);
  }
};

const calculateAverages = (report, divisor) => {
  const newReport = { ...report };

  newReport.emotionalAnalysis.averageIntensity /= divisor;
  newReport.communicationPatterns.averageFormality /= divisor;
  newReport.communicationPatterns.styleMetrics.assertiveness /= divisor;
  newReport.communicationPatterns.styleMetrics.openness /= divisor;
  newReport.communicationPatterns.styleMetrics.engagement /= divisor;
  newReport.psychologicalProfile.averageStress /= divisor;
  newReport.psychologicalProfile.averageConfidence /= divisor;
  newReport.psychologicalProfile.averageAnxiety /= divisor;
  newReport.socialInteraction.averageCooperation /= divisor;
  newReport.socialInteraction.averageDominance /= divisor;
  newReport.socialInteraction.averageEmpathy /= divisor;

  return newReport;
};

const calculateMessageFrequency = (messages) => {
  return messages.reduce((acc, msg) => {
    const date = new Date(msg.created_at).toISOString().split("T")[0];
    return {
      ...acc,
      [date]: (acc[date] || 0) + 1,
    };
  }, {});
};

const getTopItems = (obj, limit) => {
  return Object.entries(obj)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

const generateEmptyReport = (startDate, endDate) => ({
  metadata: {
    totalMessages: 0,
    timespan: { startDate, endDate },
    analysisTimestamp: new Date().toISOString(),
  },
  error: "No messages found in the specified time range",
});

const processAnalysisResults = (analysisResults, startDate, endDate) => {
  try {
    const messages = analysisResults.length;
    if (messages === 0) {
      return generateEmptyReport(startDate, endDate);
    }

    const initialReport = {
      metadata: {
        totalMessages: messages,
        timespan: { startDate, endDate },
        analysisTimestamp: new Date().toISOString(),
      },
      emotionalAnalysis: {
        primaryEmotions: {},
        secondaryEmotions: {},
        averageIntensity: 0,
        emotionalVolatility: 0,
      },
      communicationPatterns: {
        averageFormality: 0,
        styleMetrics: {
          assertiveness: 0,
          openness: 0,
          engagement: 0,
        },
      },
      psychologicalProfile: {
        averageStress: 0,
        averageConfidence: 0,
        averageAnxiety: 0,
        stressPattern: [],
      },
      socialInteraction: {
        averageCooperation: 0,
        averageDominance: 0,
        averageEmpathy: 0,
      },
      sentimentAnalysis: {
        distribution: { positive: 0, neutral: 0, negative: 0 },
        sentimentTrend: [],
      },
      contentAnalysis: {
        commonTags: {},
        messageFrequency: calculateMessageFrequency(analysisResults),
      },
    };

    const report = analysisResults.reduce((acc, result, index, array) => {
      const analysis = result.analysis;
      const newAcc = { ...acc };

      newAcc.emotionalAnalysis.primaryEmotions[analysis.primaryEmotion] =
        (acc.emotionalAnalysis.primaryEmotions[analysis.primaryEmotion] || 0) +
        1;

      analysis.secondaryEmotions?.forEach((emotion) => {
        newAcc.emotionalAnalysis.secondaryEmotions[emotion] =
          (acc.emotionalAnalysis.secondaryEmotions[emotion] || 0) + 1;
      });

      newAcc.emotionalAnalysis.averageIntensity += analysis.intensity;
      newAcc.communicationPatterns.averageFormality += analysis.formality;
      newAcc.communicationPatterns.styleMetrics.assertiveness +=
        analysis.communicationStyle.assertiveness;
      newAcc.communicationPatterns.styleMetrics.openness +=
        analysis.communicationStyle.openness;
      newAcc.communicationPatterns.styleMetrics.engagement +=
        analysis.communicationStyle.engagement;

      newAcc.psychologicalProfile.averageStress +=
        analysis.psychologicalIndicators.stress;
      newAcc.psychologicalProfile.averageConfidence +=
        analysis.psychologicalIndicators.confidence;
      newAcc.psychologicalProfile.averageAnxiety +=
        analysis.psychologicalIndicators.anxiety;

      newAcc.socialInteraction.averageCooperation +=
        analysis.socialDynamics.cooperation;
      newAcc.socialInteraction.averageDominance +=
        analysis.socialDynamics.dominance;
      newAcc.socialInteraction.averageEmpathy +=
        analysis.socialDynamics.empathy;

      newAcc.sentimentAnalysis.distribution[analysis.sentiment]++;

      newAcc.psychologicalProfile.stressPattern.push({
        timestamp: result.created_at,
        stress: analysis.psychologicalIndicators.stress,
      });

      newAcc.sentimentAnalysis.sentimentTrend.push({
        timestamp: result.created_at,
        sentiment: analysis.sentiment,
        intensity: analysis.intensity,
      });

      analysis.contentTags?.forEach((tag) => {
        newAcc.contentAnalysis.commonTags[tag] =
          (acc.contentAnalysis.commonTags[tag] || 0) + 1;
      });

      if (index === array.length - 1) {
        const sentimentChanges = array.slice(1).reduce((changes, curr, i) => {
          return (
            changes +
            (curr.analysis.sentiment !== array[i].analysis.sentiment ? 1 : 0)
          );
        }, 0);
        newAcc.emotionalAnalysis.emotionalVolatility =
          sentimentChanges / (array.length - 1);
      }

      return newAcc;
    }, initialReport);

    // console.log("Report", report);

    const finalReport = calculateAverages(report, messages);
    finalReport.contentAnalysis.commonTags = getTopItems(
      finalReport.contentAnalysis.commonTags,
      10
    );
    // console.log("Final Report", finalReport);

    return finalReport;
  } catch (err) {
    console.error(err);
  }
};

global.ai.generateReport = async (
  chatId,
  childNumber,
  startDate,
  endDate,
  tableId
) => {
  try {
    const { data: messages, error } = await supabase
      .from(`messages_test_${tableId}`)
      .select("*")
      .eq("chat_id", chatId)
      .eq("sender_number", childNumber);
    // .gte("created_at", startDate)
    // .lte("created_at", endDate)
    // .order("created_at", { ascending: true });

    if (error) throw error;

    const analysisResults = await Promise.all(
      messages.map(async (msg) => ({
        ...msg,
        analysis: await global.ai.analyzeTone(msg.content),
      }))
    );

    return processAnalysisResults(analysisResults, startDate, endDate);
  } catch (err) {
    console.error("Error generating report:", err);
    throw err;
  }
};
