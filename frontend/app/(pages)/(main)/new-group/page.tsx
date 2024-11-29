/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Install from "@/components/Install";

const supabase = createClient();

export default function Home() {

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const handleGetInitialData = async () => {
      const { data, error } = await supabase.from("messages").select("*");
      if (error) {
        console.error(error);
      }

      if (data) {
        setMessages(data as any[]);
      }
    };

    const addMessage = async (payload: any) => {
      try {
        if (payload.eventType === "INSERT") {
          console.log(payload.new);
          setMessages([...messages, payload.new]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    handleGetInitialData();
    const channel = supabase.channel("messages_channel").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, addMessage).subscribe();
    return () => {
      channel.unsubscribe();
    }
  }, []);

  return (
    <div className="items-center justify-items-center font-[roboto] w-fit">
      <main className="flex-col flex gap-4 py-4">
        <Install />
      </main>
    </div>
  );
}
