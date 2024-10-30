/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const { lastMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      console.log("Last message received:", lastMessage.data);
      try {
        const messageData = JSON.parse(lastMessage.data);
        console.log("Parsed message data:", messageData);
        if (messageData.type === "message") {
          console.log("Message from whatsap:", messageData.msg);
          setMessages([...messages, messageData.msg]);
        }
      } catch (error) {
        console.error("Failed to parse message data:", error);
      }
    }
  }, [lastMessage]);

  return (
    <div className="items-center justify-items-center font-[roboto]">
      <main className="flex-col flex gap-2">
        {messages.map((item: any, index) => (
          <div key={index}>
            {item?.body}
          </div>
        ))}
      </main>
    </div>
  );
}
