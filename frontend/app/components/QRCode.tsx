/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react";
import { useQRCode } from 'next-qrcode';
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const WhatsAppBot = () => {
  const { Canvas } = useQRCode();
  const [qrCode, setQrCode] = useState("2@NbOCZPNg1wb1LtlDGzfoVrHuUrnA4Kv7N5c23v01X5SqAcy0NclyGQEU5Vh26too+LClckUZ6kIN8MNub0+bqPT2B6smo9rO8HY=,wS/voiQ4pEqvwAp82lHcZhQkeeFA8kgi2LY8u1BK/Vg=,NUI3NPFxTSfNmZELunhk7uh2eYdihiN7YHnrqWQu1hI=,M6PfUTf2pVcJHmJH5L13h72iZFa32EJTu+SGTXXYplI=,1");

  useEffect(() => {
    const handleGetQRCode = async () => {
      try {
        const { data }: { data: any } = await supabase.from("qrcodes").select("qrcode").eq("id", 1);
        if (data === null && data.length === 0) {
          return;
        }
        const [currentQrCode] = data;
        setQrCode(currentQrCode.qrcode);
      } catch (err) {
        console.error(err);
      }
    }

    const setQRCode = async (payload: any) => {
      try {
        console.log("payload", payload);
        if (payload.eventType === "UPDATE") {
          console.log("QRCode", payload.new.qrcode);
          setQrCode(payload.new.qrcode);
        }
      } catch (err) {
        console.error(err);
      }
    }

    const channel = supabase.channel("qrcodes_channel").on("postgres_changes", { event: "UPDATE", schema: "public", table: "qrcodes" }, setQRCode).subscribe();
    handleGetQRCode();
    return () => {
      channel.unsubscribe();
    }
  }, []);

  return (
    <Canvas
      text={qrCode}
      options={{
        errorCorrectionLevel: 'M',
        margin: 2,
        scale: 4,
        width: 400,
      }}
    />
  )
}

export default WhatsAppBot;