/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { getReport } from "@/apis/report";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  BiMessageDetail,
  BiPulse,
  BiHeart,
  BiTrendingUp,
} from "react-icons/bi";
import {
  RiEmotionLine,
  RiEmotionHappyLine,
  RiEmotionNormalLine,
} from "react-icons/ri";
import {
  MdOutlineInterests,
  MdOutlinePsychology
} from "react-icons/md";
// import Test from "@/components/Test";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const Reports = () => {
  const mockupData = {
    "metadata": {
      "totalMessages": 12,
      "timespan": {
        "startDate": "2024-11-10",
        "endDate": "2024-11-12"
      },
      "analysisTimestamp": "2024-11-12T19:38:39.133Z"
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
      "averageIntensity": 4.75,
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
      "averageStress": 1.8333333333333333,
      "averageConfidence": 5.583333333333333,
      "averageAnxiety": 2.4166666666666665,
      "stressPattern": [
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 2
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 1
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 2
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 1
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 2
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 4
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 1
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 2
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 2
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 2
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 1
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "stress": 2
        }
      ]
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
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "positive",
          "intensity": 7
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "positive",
          "intensity": 6
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "neutral",
          "intensity": 3
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "positive",
          "intensity": 4
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "positive",
          "intensity": 5
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "positive",
          "intensity": 7
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "positive",
          "intensity": 3
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "neutral",
          "intensity": 3
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "positive",
          "intensity": 5
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "positive",
          "intensity": 4
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "positive",
          "intensity": 7
        },
        {
          "timestamp": "2024-11-11T07:36:50.726843+00:00",
          "sentiment": "positive",
          "intensity": 3
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
      }
    }
  };

  const supabase = createClient();
  const [data, setData] = useState<any>(mockupData);
  const [loading, setLoading] = useState(false);
  const [isData, setIsData] = useState(false);

  const handleGetReport = useCallback(async (payload: any) => {
    try {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        console.log(payload.new);
        setData(JSON.parse(payload.new.data));
        setIsData(true);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleGetInitialReport = async () => {
    try {
      setLoading(true);
      const { data: session, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (session.session) {
        const { data, error } = await supabase.from("reports").select("*").eq("parent_id", session.session.user.id);
        if (error) throw error;
        if (data.length) {
          const report: any = data[0];
          setData(JSON.parse(report.data));
          setIsData(true);
        } else {
          const { data: consentMessages, error } = await supabase.from("consent-messages").select("*").eq("parent_id", session.session.user.id);
          if (error) throw error;
          if (consentMessages.length) {
            const data: any = consentMessages[0];
            const response = await getReport({ groupId: data?.group_id, phoneNumber: data?.phone_number, startDate: "2024-11-10", endDate: "2024-11-14" });
            if (response.status === "success") {
              setData(response.data);
              setIsData(true);
            }
          } else {
            toast.error("You didn't install the service.");
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
    handleGetInitialReport();
  }, [])

  useEffect(() => {
    const channel = supabase.channel("reports").on("postgres_changes", { event: "*", schema: "public", table: "messages" }, handleGetReport).subscribe();
    return () => {
      channel.unsubscribe();
    }
  }, [handleGetReport, supabase]);

  // const handleGetReport = async (table: string, phoneNumber: string) => {
  //   try {
  //     setLoading(true);

  //     const response = await getReport({ groupId: "120363345932571412@g.us", phoneNumber, tableId: table, startDate: "2024-11-10", endDate: "2024-11-14" });

  //     if (response.status === "success") {
  //       console.log("Report Data", response.data);
  //       setData(response.data);
  //       toast.success("Successfully generate the report.");
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (err: any) {
  //     console.error(err);
  //     toast.error(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   handleGetReport("1", "18406880000")
  // }, [])

  const getEmotionIcon = (emotion: any) => {
    const iconProps = { className: "w-6 h-6 text-yellow-500" };
    switch (emotion.toLowerCase()) {
      case 'happiness':
        return <RiEmotionHappyLine {...iconProps} />;
      case 'curiosity':
        return <MdOutlineInterests {...iconProps} />;
      case 'excitement':
        return <BiPulse {...iconProps} />;
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

  return (
    <div className="flex flex-col gap-4">
      {/* <Test onGetReport={handleGetReport} loading={loading} /> */}
      {loading ? <Spinner /> :
        (!isData ?
          <div className="flex flex-col gap-4 text-center">
            <div>{`You didn't install the service.`}</div>
            <Link href="/overview" className="text-blue-400 hover:text-blue-600 underline">Go to install page</Link>
          </div>
          : <div className="w-full p-4 space-y-4 bg-gray-900 min-h-screen rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Analysis Report</h1>
              <div className="text-gray-400">
                {data.metadata.timespan.startDate} ~ {data.metadata.timespan.endDate}
              </div>
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
                  <RiEmotionLine className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-gray-400">Emotional Intensity</p>
                    <h3 className="text-2xl font-bold text-white">{data.emotionalAnalysis.averageIntensity.toFixed(2)}</h3>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800">
                <CardBody className="flex flex-row items-center space-x-4">
                  <MdOutlinePsychology className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-gray-400">Average Stress</p>
                    <h3 className="text-2xl font-bold text-white">{data.psychologicalProfile.averageStress.toFixed(2)}</h3>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
                      <LineChart data={data.sentimentAnalysis.sentimentTrend}>
                        <XAxis dataKey="timestamp" hide />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="intensity"
                          stroke="#3b82f6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800">
                <CardHeader className="pb-0 pt-6 px-4">
                  <div className="flex items-center space-x-2">
                    <BiPulse className="w-6 h-6 text-red-500" />
                    <h4 className="text-xl font-bold text-white">Stress Pattern</h4>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.psychologicalProfile.stressPattern}>
                        <XAxis dataKey="timestamp" hide />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="stress"
                          stroke="#ef4444"
                          strokeWidth={2}
                        />
                      </LineChart>
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
          </div>)}
    </div>
  );
}

export default Reports;