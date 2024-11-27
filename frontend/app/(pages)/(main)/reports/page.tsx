/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { getReport } from "@/apis/report";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  BiMessageDetail,
  BiHeart,
  BiTrendingUp,
  BiGroup,
  BiTimeFive,
} from "react-icons/bi";
import {
  RiEmotionLine,
  RiEmotionHappyLine,
  RiEmotionNormalLine,
} from "react-icons/ri";
import { MdOutlineInterests } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import GroupSelector from "@/components/GroupSelector";
import { useUserAuth } from "@/contexts/UserContext";

const Reports = () => {
  const mockupData = {
    "metadata": {
      "totalMessages": 12,
      "timespan": {
        "startDate": "2024-11-10",
        "endDate": "2024-11-12"
      },
      "analysisTimestamp": "2024-11-12T19:38:39.133Z",
      "numberOfParticipants": 5,
    },
    "emotionalAnalysis": {
      "primaryEmotions": {
        "happiness": 2,
        "casualness": 1,
        "curiosity": 3,
        "excitement": 2,
        "interest": 1,
        "enthusiasm": 2,
        "anticipation": 1
      },
      "secondaryEmotions": {
        "pride": 2,
        "enthusiasm": 2,
        "excitement": 1,
        "forgetfulness": 1,
        "interest": 3,
        "fear": 2,
        "admiration": 1,
        "amazement": 1,
        "curiosity": 1,
        "anticipation": 3,
        "cooperation": 2,
        "openness": 1
      },
      "emotionalVolatility": 0.36363636363636365
    },
    "communicationPatterns": {
      "averageFormality": 2.1666666666666665,
      "styleMetrics": {
        "assertiveness": 3.5,
        "openness": 7.416666666666667,
        "engagement": 6.5
      }
    },
    "psychologicalProfile": {
      "averageConfidence": 5.583333333333333,
      "averageAnxiety": 2.4166666666666665
    },
    "socialInteraction": {
      "averageCooperation": 6.666666666666667,
      "averageDominance": 2.5,
      "averageEmpathy": 6.25
    },
    "sentimentAnalysis": {
      "distribution": {
        "positive": 10,
        "neutral": 2,
        "negative": 0
      },
      "sentimentTrend": [
        {
          "date": "2024-11-11",
          "positive": 8,
          "negative": 0
        },
        {
          "date": "2024-11-12",
          "positive": 2,
          "negative": 0
        }
      ]
    },
    "contentAnalysis": {
      "commonTags": {
        "enthusiasm": 2,
        "collaboration": 2,
        "planning": 2,
        "personal achievement": 1,
        "sports": 1,
        "art": 1,
        "leisure": 1,
        "creativity": 1,
        "casual planning": 1,
        "social interaction": 1
      },
      "messageFrequency": {
        "2024-11-11": 12
      },
      "mostActiveTime": "14:00"
    },
    "areasOfFocus": {
      "bullyingHarassment": 0,
      "anxietyStress": 0,
      "inappropriateContent": 0,
      "substanceUse": 0,
      "riskyBehavior": 0,
      "socialExclusion": 0
    },
    "slangDictionary": {
      "GOAT": "Greatest Of All Time",
      "KYS": "Kill Yourself"
    }
  };

  const supabase = createClient();
  const [data, setData] = useState<any>(mockupData);
  const [loading, setLoading] = useState(false);
  const [isData, setIsData] = useState(false);
  const [groupId, setGroupId] = useState("");
  const { user } = useUserAuth();

  const handleGetReport = useCallback(async (payload: any) => {
    try {
      console.log(payload);
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        console.log(payload.new);
        if (payload.new.group_id === groupId) {
          setData(JSON.parse(payload.new.data));
          setIsData(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [groupId]);

  const handleGetReportByRequest = async (groupId: string, phoneNumber: string) => {
    try {
      setGroupId(groupId);
      setLoading(true);
      if (user?.id) {
        const { data, error } = await supabase.from("reports").select("*").eq("parent_id", user.id).eq("group_id", groupId);
        if (error) throw error;
        if (data.length) {
          const report: any = data[0];
          setData(JSON.parse(report.data));
          setIsData(true);
        } else {
          const response = await getReport({ groupId, phoneNumber, startDate: "2024-11-10", endDate: "2024-11-14" });
          if (response.status === "success") {
            setData(response.data);
            setIsData(true);
          } else {
            return toast.error(response.message);
          }
        }
      } else {
        return toast.error("Please sign in first.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const channel = supabase.channel("reports_channel").on("postgres_changes", { event: "*", schema: "public", table: "reports" }, handleGetReport).subscribe();
    return () => {
      channel.unsubscribe();
    }
  }, [handleGetReport, supabase]);

  const getEmotionIcon = (emotion: any) => {
    const iconProps = { className: "w-6 h-6 text-yellow-500" };
    switch (emotion.toLowerCase()) {
      case 'happiness':
        return <RiEmotionHappyLine {...iconProps} />;
      case 'curiosity':
        return <MdOutlineInterests {...iconProps} />;
      case 'excitement':
        return <BiTrendingUp {...iconProps} />;
      case 'enthusiasm':
        return <RiEmotionLine {...iconProps} />;
      case 'interest':
        return <MdOutlineInterests {...iconProps} />;
      case 'anticipation':
        return <BiTrendingUp {...iconProps} />;
      case 'casualness':
        return <RiEmotionNormalLine {...iconProps} />;
      default:
        return <RiEmotionLine {...iconProps} />;
    }
  };

  const emotionsList = Object.entries<number>(data.emotionalAnalysis.primaryEmotions)
    .map(([emotion, value]) => ({
      emotion,
      value
    }))
    .sort((a, b) => b.value - a.value);

  try {

    return (
      <div className="flex flex-col gap-4 w-full">
        <GroupSelector onGetReport={handleGetReportByRequest} loading={loading} />
        {loading ? <Spinner /> :
          (!isData ?
            <div className="flex flex-col gap-4 text-center">
              <div>{`You didn't install the service or there is no data.`}</div>
              <Link href="/new-group" className="text-blue-400 hover:text-blue-600 underline">Go to install page</Link>
            </div>
            : <div className="w-full p-4 space-y-4 bg-gray-900 min-h-screen rounded-lg">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Analysis Report</h1>
                {/* <div className="text-gray-400">
                {data.metadata.timespan.startDate} ~ {data.metadata.timespan.endDate}
              </div> */}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gray-800">
                  <CardBody className="flex flex-row items-center space-x-4">
                    <BiMessageDetail className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-gray-400">Total Messages</p>
                      <h3 className="text-2xl font-bold text-white">{data.metadata.totalMessages}</h3>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-gray-800">
                  <CardBody className="flex flex-row items-center space-x-4">
                    <BiGroup className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-gray-400">Participants</p>
                      <h3 className="text-2xl font-bold text-white">{data.metadata.numberOfParticipants}</h3>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-gray-800">
                  <CardBody className="flex flex-row items-center space-x-4">
                    <BiTimeFive className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-gray-400">Most Active Time</p>
                      <h3 className="text-2xl font-bold text-white">{data.contentAnalysis.mostActiveTime}</h3>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-gray-800">
                  <CardBody className="flex flex-row items-center space-x-4">
                    <BiHeart className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="text-gray-400">Positive Messages</p>
                      <h3 className="text-2xl font-bold text-white">{data.sentimentAnalysis.distribution.positive}</h3>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
                <Card className="bg-gray-800">
                  <CardHeader className="pb-0 pt-6 px-4">
                    <div className="flex items-center space-x-2">
                      <BiTrendingUp className="w-6 h-6 text-blue-500" />
                      <h4 className="text-xl font-bold text-white">Sentiment Trend</h4>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.sentimentAnalysis.sentimentTrend}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="positive" fill="#3b82f6" />
                          <Bar dataKey="negative" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Primary Emotions */}
              <Card className="bg-gray-800">
                <CardHeader className="pb-0 pt-6 px-4">
                  <div className="flex items-center space-x-2">
                    <RiEmotionLine className="w-6 h-6 text-yellow-500" />
                    <h4 className="text-xl font-bold text-white">Primary Emotions</h4>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {emotionsList.map(({ emotion, value }) => (
                      <div
                        key={emotion}
                        className="flex items-center space-x-2 bg-gray-700 p-4 rounded-lg"
                      >
                        {getEmotionIcon(emotion)}
                        <div>
                          <p className="text-gray-300 capitalize">{emotion}</p>
                          <p className="text-lg font-bold text-white">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Areas of Focus */}
              <Card className="bg-gray-800">
                <CardHeader className="pb-0 pt-6 px-4">
                  <div className="flex items-center space-x-2">
                    <MdOutlineInterests className="w-6 h-6 text-green-500" />
                    <h4 className="text-xl font-bold text-white">Areas of Focus</h4>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries<number>(data.areasOfFocus).map(([focusArea, count]) => (
                      <div key={focusArea} className="flex items-center space-x-2 bg-gray-700 p-4 rounded-lg">
                        <div>
                          <p className="text-gray-300 capitalize">{focusArea}</p>
                          <p className="text-lg font-bold text-white">{count}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Slang Dictionary */}
              <Card className="bg-gray-800">
                <CardHeader className="pb-0 pt-6 px-4">
                  <div className="flex items-center space-x-2">
                    <RiEmotionLine className="w-6 h-6 text-blue-500" />
                    <h4 className="text-xl font-bold text-white">Slang Dictionary</h4>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries<string>(data.slangDictionary).map(([slang, definition]) => (
                      <div key={slang} className="flex flex-col bg-gray-700 p-4 rounded-lg">
                        <p className="text-gray-300">{slang}</p>
                        <p className="text-sm text-gray-400">{definition}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>)}
      </div>
    );
  } catch (err: any) {
    console.error(err);
    return <div>{err.message}</div>
  }
}

export default Reports;