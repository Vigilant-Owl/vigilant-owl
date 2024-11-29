const OpenAI = require("openai");
const supabase = require("../config/supabase");

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const SYSTEM_PROMPT = {
  toneAnalysis: `You are an advanced linguistic and psychological analysis expert. Analyze the following message and provide a detailed assessment in JSON format. Consider:

1. Emotional indicators
2. Communication style
3. Psychological markers
4. Social dynamics
5. Identify focus areas such as bullying, harassment, anxiety, stress, inappropriate content, substance use, risky behavior, and social exclusion.
   - Use relevant keywords and context clues to determine the presence of these focus areas.
   - Provide a confidence score (1-10) for each identified focus area.

Provide a JSON response with the following structure:
{
  "primaryEmotion": string,
  "secondaryEmotions": string[],
  "formality": number (1-10),
  "sentiment": "positive" | "neutral" | "negative",
  "communicationStyle": {
    "assertiveness": number (1-10),
    "openness": number (1-10),
    "engagement": number (1-10)
  },
  "psychologicalIndicators": {
    "confidence": number (1-10),
    "anxiety": number (1-10)
  },
  "socialDynamics": {
    "cooperation": number (1-10),
    "dominance": number (1-10),
    "empathy": number (1-10)
  },
  "contentTags": string[],
  "identifiedSlang": { 
    "slangTerm": "Definition of the slang term",
  },
  "focusAreas": {
    "bullyingHarassment": number (0-5),
    "anxietyStress": number (0-5),
    "inappropriateContent": number (0-5),
    "substanceUse": number (0-5),
    "riskyBehavior": number (0-5),
    "socialExclusion": number (0-5)
  }
}`,
};

const generateFallbackAnalysis = (error) => ({
  primaryEmotion: "unknown",
  secondaryEmotions: [],
  formality: 5,
  sentiment: "neutral",
  communicationStyle: {
    assertiveness: 5,
    openness: 5,
    engagement: 5,
  },
  psychologicalIndicators: {
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
global.ai.analyzeTone = async (message, retries = 5, delay = 200) => {
  try {
    console.log("AI input", message);
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
    });

    const responseContent = completion.choices[0].message.content;
    console.log("AI Output", responseContent);
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseContent);
    } catch (err) {
      console.error("Error parsing JSON response:", err);
      if (retries > 0) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return global.ai.analyzeTone(message, retries - 1, delay);
      }
      return generateFallbackAnalysis(err);
    }

    return jsonResponse;
  } catch (error) {
    console.error("Error in tone analysis:", error);
    return generateFallbackAnalysis(error);
  }
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

const generateEmptyReport = (numberOfParticipants, startDate, endDate) => ({
  metadata: {
    totalMessages: 0,
    numberOfParticipants,
    timespan: { startDate, endDate },
    analysisTimestamp: new Date().toISOString(),
  },
  error: "No messages found in the specified time range",
});

const processAnalysisResults = (
  analysisResults,
  numberOfParticipants,
  startDate,
  endDate
) => {
  try {
    const messages = analysisResults.length;
    if (messages === 0) {
      return generateEmptyReport(numberOfParticipants, startDate, endDate);
    }

    const focusAreaDataByDate = {}; // This will hold total and count data for averaging

    const initialReport = {
      metadata: {
        totalMessages: messages,
        timespan: { startDate, endDate },
        analysisTimestamp: new Date().toISOString(),
        numberOfParticipants,
      },
      emotionalAnalysis: {
        primaryEmotions: {},
        secondaryEmotions: {},
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
        averageConfidence: 0,
        averageAnxiety: 0,
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
        chatActivity: {},
      },
      areasOfFocus: {
        bullyingHarassment: 0,
        anxietyStress: 0,
        inappropriateContent: 0,
        substanceUse: 0,
        riskyBehavior: 0,
        socialExclusion: 0,
      },
      slangDictionary: {},
    };

    const report = analysisResults.reduce((acc, result, index, array) => {
      const analysis = result.analysis;
      const newAcc = { ...acc };

      // Extract the date from the message
      const date = new Date(result.created_at).toISOString().split("T")[0];

      // Continue with the rest of the processing as before
      newAcc.emotionalAnalysis.primaryEmotions[analysis.primaryEmotion] =
        (acc.emotionalAnalysis.primaryEmotions[analysis.primaryEmotion] || 0) +
        1;

      analysis.secondaryEmotions?.forEach((emotion) => {
        newAcc.emotionalAnalysis.secondaryEmotions[emotion] =
          (acc.emotionalAnalysis.secondaryEmotions[emotion] || 0) + 1;
      });

      newAcc.communicationPatterns.averageFormality += analysis.formality;
      newAcc.communicationPatterns.styleMetrics.assertiveness +=
        analysis.communicationStyle.assertiveness;
      newAcc.communicationPatterns.styleMetrics.openness +=
        analysis.communicationStyle.openness;
      newAcc.communicationPatterns.styleMetrics.engagement +=
        analysis.communicationStyle.engagement;

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

      // Update sentiment trend
      const trendItem = newAcc.sentimentAnalysis.sentimentTrend.find(
        (item) => item.date === date
      );
      if (trendItem) {
        trendItem[analysis.sentiment]++;
      } else {
        newAcc.sentimentAnalysis.sentimentTrend.push({
          date,
          positive: analysis.sentiment === "positive" ? 1 : 0,
          neutral: analysis.sentiment === "neutral" ? 1 : 0,
          negative: analysis.sentiment === "negative" ? 1 : 0,
        });
      }

      analysis.contentTags?.forEach((tag) => {
        newAcc.contentAnalysis.commonTags[tag] =
          (acc.contentAnalysis.commonTags[tag] || 0) + 1;
      });

      // Calculate chat activity by time of day
      const hour = new Date(result.created_at).getHours();
      newAcc.contentAnalysis.chatActivity[hour] =
        (acc.contentAnalysis.chatActivity[hour] || 0) + 1;

      // Handle slang dictionary
      analysis.contentTags.forEach((tag) => {
        if (tag.match(/slang/)) {
          newAcc.slangDictionary[tag] = "Definition of " + tag; // Placeholder definition
        }
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

      try {
        Object.entries(analysis.identifiedSlang).forEach(
          ([slang, definition]) => {
            newAcc.slangDictionary[slang] = definition;
          }
        );
      } catch (err) {
        console.error(err);
      }

      try {
        Object.keys(analysis.focusAreas).forEach((area) => {
          newAcc.areasOfFocus[area] += analysis.focusAreas[area];
        });
      } catch (err) {
        console.error(err);
      }

      return newAcc;
    }, initialReport);

    const finalReport = calculateAverages(report, messages);
    finalReport.contentAnalysis.commonTags = getTopItems(
      finalReport.contentAnalysis.commonTags,
      10
    );

    // Determine the most active time of day
    const activeTime = Object.entries(
      finalReport.contentAnalysis.chatActivity
    ).sort(([, a], [, b]) => b - a)[0]?.[0];
    finalReport.contentAnalysis.mostActiveTime = activeTime
      ? `${activeTime}:00`
      : "Unknown";

    Object.keys(report.areasOfFocus).forEach((area) => {
      report.areasOfFocus[area] = Math.round(
        report.areasOfFocus[area] / analysisResults.length
      );
    });

    return finalReport;
  } catch (err) {
    console.error(err);
  }
};

const calculateAverages = (report, divisor) => {
  const newReport = { ...report };

  newReport.communicationPatterns.averageFormality /= divisor;
  newReport.communicationPatterns.styleMetrics.assertiveness /= divisor;
  newReport.communicationPatterns.styleMetrics.openness /= divisor;
  newReport.communicationPatterns.styleMetrics.engagement /= divisor;
  newReport.psychologicalProfile.averageConfidence /= divisor;
  newReport.psychologicalProfile.averageAnxiety /= divisor;
  newReport.socialInteraction.averageCooperation /= divisor;
  newReport.socialInteraction.averageDominance /= divisor;
  newReport.socialInteraction.averageEmpathy /= divisor;

  return newReport;
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
      .from("analysis_messages")
      .select("*")
      .eq("chat_id", chatId)
      .eq("sender_number", childNumber);

    if (error) throw error;
    if (messages.length === 0) {
      return "no data";
    }

    const analysisResults = [];

    for (const msg of messages) {
      try {
        analysisResults.push({
          created_at: msg.created_at,
          analysis: JSON.parse(msg.data),
        });
      } catch (error) {
        console.error("Error analyzing message:", error);
      }
    }

    let numberOfParticipants = 0;
    try {
      const {
        data: { member_count },
        error,
      } = await supabase
        .from("consent_messages")
        .select("member_count")
        .eq("group_id", chatId)
        .single();
      if (member_count) {
        numberOfParticipants = member_count;
      }
    } catch (err) {
      console.error(err);
    }

    return processAnalysisResults(
      analysisResults,
      numberOfParticipants,
      startDate,
      endDate
    );
  } catch (err) {
    console.error("Error generating report:", err);
    throw err;
  }
};
