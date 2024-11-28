/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { getReport } from "@/apis/report";
import { Card, CardBody, CardHeader, Spinner, Button, Select, SelectItem } from "@nextui-org/react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
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
import { useUserAuth } from "@/contexts/UserContext";

const Reports = () => {
  const mockupData = {
    "metadata": {
      "totalMessages": 10,
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
      "chatActivity": {
        "14": 10
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
    "focusAreaByDate": [
      { date: "2024-11-10", bullyingHarassment: 1, anxietyStress: 2, inappropriateContent: 0, substanceUse: 0, riskyBehavior: 1, socialExclusion: 0 },
      { date: "2024-11-11", bullyingHarassment: 0, anxietyStress: 1, inappropriateContent: 1, substanceUse: 1, riskyBehavior: 0, socialExclusion: 1 },
      { date: "2024-11-12", bullyingHarassment: 2, anxietyStress: 0, inappropriateContent: 2, substanceUse: 0, riskyBehavior: 1, socialExclusion: 0 },
    ],
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
  const [groupIndex, setGroupIndex] = useState(0);
  const [group, setGroup] = useState({
    group_id: "",
    title: "",
    phone_number: ""
  });
  const [groups, setGroups] = useState([]);

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

  const handleGetReportByRequest = useCallback(async (groupId: string, phoneNumber: string) => {
    try {
      setGroupId(groupId);
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
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  const handleGetGroupData = useCallback(async () => {
    try {
      if (user?.id) {
        setLoading(true);
        const { data, error } = await supabase.rpc("get_group_data", { user_id: user.id });
        if (error) {
          throw error;
        }
        setGroups(data);
        if (data.length) {
          setGroupIndex(0);
          setGroup(data[0]);
          handleGetReportByRequest(data[0].group_id, data[0].phone_number);
        } else {
          toast.error("You didn't install the service or there is no data.");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    handleGetGroupData();
    const channel = supabase.channel("reports_channel").on("postgres_changes", { event: "*", schema: "public", table: "reports" }, handleGetReport).subscribe();
    return () => {
      channel.unsubscribe();
    }
  }, [handleGetGroupData, handleGetReport, supabase]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center px-4 w-full min-w-fit">
          <Select
            disallowEmptySelection
            isRequired
            label="Select group"
            className="w-full min-w-60"
            selectedKeys={[`${groupIndex}`]}
            onSelectionChange={(keys: any) => {
              const [value] = keys;
              setGroupIndex(value);
              setGroup(groups[value]);
            }}
            defaultSelectedKeys={["None"]}
            isDisabled={loading}
          >
            {groups.map((group: any, index: number) => (
              <SelectItem key={index}>
                {`${group.title} (${group.group_id})`}
              </SelectItem>
            ))}
          </Select>
          <Select
            disallowEmptySelection
            isRequired
            isDisabled={loading}
            label="Select phone number"
            className="w-full min-w-48"
            selectedKeys={[group.phone_number]}
            defaultSelectedKeys={["None"]}
          // onSelectionChange={(keys: any) => {
          //   const [value] = keys;
          //   setPhoneNumber(value);
          // }}
          >
            <SelectItem key={group.phone_number}>
              {group.phone_number}
            </SelectItem>
            {/* {phoneNumbers.map(phoneNumber => (
          <SelectItem key={phoneNumber}>
            {phoneNumber}
          </SelectItem>
        ))} */}
          </Select>
          <Button color="primary" isLoading={loading} onClick={() => {
            if (group.group_id == "") {
              return toast.error("Please select the group.");
            }
            if (group.phone_number == "") {
              return toast.error("Please select the child's phone number.");
            }
            handleGetReportByRequest(group.group_id, group.phone_number);
          }}>
            Get Report
          </Button>
        </div >
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
                        <LineChart data={data.sentimentAnalysis.sentimentTrend.map((trend: any) => ({
                          ...trend,
                          negative: -trend.negative,
                          state: trend.positive - trend.negative
                        }))}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          {/* <Line type="monotone" dataKey="positive" stroke="#3b82f6" />
                          <Line type="monotone" dataKey="negative" stroke="#ef4444" /> */}
                          <Line type="monotone" dataKey="state" stroke="#3b82f6" />
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

              {/* Areas of Focus */}
              <Card className="bg-gray-800">
                <CardHeader className="pb-0 pt-6 px-4">
                  <div className="flex items-center space-x-2">
                    <MdOutlineInterests className="w-6 h-6 text-green-500" />
                    <h4 className="text-xl font-bold text-white">Areas of Focus by Date</h4>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.focusAreaByDate}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="bullyingHarassment" stroke="#8884d8" name="Bullying Harassment" />
                        <Line type="monotone" dataKey="anxietyStress" stroke="#82ca9d" name="Anxiety & Stress" />
                        <Line type="monotone" dataKey="inappropriateContent" stroke="#ffc658" name="Inappropriate Content" />
                        <Line type="monotone" dataKey="substanceUse" stroke="#d0ed57" name="Substance Use" />
                        <Line type="monotone" dataKey="riskyBehavior" stroke="#a4de6c" name="Risky Behavior" />
                        <Line type="monotone" dataKey="socialExclusion" stroke="#ff7300" name="Social Exclusion" />
                      </LineChart>
                    </ResponsiveContainer>
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