/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "./utils/supabase/client";
import QRCode from "@/components/QRCode";
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

  useEffect(() => {
    const channel = supabase.channel("messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, addMessage).subscribe();
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
    <div className="items-center justify-items-center font-[roboto]">
      <main className="flex-col flex gap-2 py-4">
        <QRCode />
        {messages.map((item: any, index) => (
          <div key={index}>
            {item?.content}
          </div>
        ))}
      </main>
    </div>
  );
}
