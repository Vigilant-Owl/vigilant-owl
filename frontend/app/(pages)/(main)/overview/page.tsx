/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatPhoneNumberIntl } from "react-phone-number-input";
// import QRCode from "@/components/QRCode";
import Install from "@/components/Install";
// import useWebSocket from "react-use-websocket";
// const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export default function Home() {
  const supabase = createClient();

  const [messages, setMessages] = useState<any[]>([]);

  const addMessage = useCallback(async (payload: any) => {
    try {
      if (payload.eventType === "INSERT") {
        console.log(payload.new);
        setMessages([...messages, payload.new]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [messages]);

  const handleGetInitialData = async () => {
    const { data, error } = await supabase.from("messages").select("*");
    if (error) {
      console.error(error);
    }

    console.log(data);
    if (data) {
      setMessages(data as any[]);
    }
  }

  useEffect(() => {
    handleGetInitialData();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("messages_channel").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, addMessage).subscribe();
    return () => {
      channel.unsubscribe();
    }
  }, [addMessage, supabase]);
  // const { lastMessage } = useWebSocket(WS_URL, {
  //   onOpen: () => {
  //     console.log("WebSocket connection established.");
  //   },
  //   share: true,
  //   filter: () => false,
  //   retryOnError: true,
  //   shouldReconnect: () => true,
  // });

  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     console.log("Last message received:", lastMessage.data);
  //     try {
  //       const messageData = JSON.parse(lastMessage.data);
  //       console.log("Parsed message data:", messageData);
  //       if (messageData.type === "message") {
  //         console.log("Message from whatsap:", messageData.msg);
  //         setMessages([...messages, messageData.msg]);
  //       }
  //     } catch (error) {
  //       console.error("Failed to parse message data:", error);
  //     }
  //   }
  // }, [lastMessage]);

  return (
    <div className="items-center justify-items-center font-[roboto] w-fit">
      <main className="flex-col flex gap-4 py-4">
        <Install />
        {/* <QRCode /> */}
        <table className="px-4">
          <thead>
            <tr>
              <th>Number</th>
              <th>Content</th>
              {/* <th>Chat ID</th> */}
            </tr>
          </thead>
          <tbody>
            {messages.map((item: any, index) => (
              <tr key={index}>
                <td width={150} className="text-center">
                  {formatPhoneNumberIntl("+" + item?.sender_number)}
                </td>
                <td>
                  {item?.content}
                </td>
                {/* <td>
                  {item?.chat_id}
                </td> */}

              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
