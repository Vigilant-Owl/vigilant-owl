/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
// import useWebSocket, { ReadyState } from "react-use-websocket";
import { IoQrCode } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client";

// const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

const WhatsAppBot = () => {
  const supabase = createClient();
  const { onClose, isOpen, onOpenChange, onOpen } = useDisclosure();
  const [qrCode, setQrCode] = useState("");
  // const { sendJsonMessage, readyState, lastMessage } = useWebSocket(WS_URL, {
  //   onOpen: () => {
  //     console.log("WebSocket connection established.");
  //   },
  //   share: true,
  //   filter: () => false,
  //   retryOnError: true,
  //   shouldReconnect: () => true,
  // });

  // useEffect(() => {
  //   if (readyState === ReadyState.OPEN) {
  //     sendJsonMessage({ type: "qrcode" });
  //   }
  // }, [sendJsonMessage, readyState]);

  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     console.log("Last message received:", lastMessage.data);
  //     try {
  //       const messageData = JSON.parse(lastMessage.data);
  //       console.log("Parsed message data:", messageData);
  //       if (messageData.type === "qrcode") {
  //         console.log("Setting QR code:", messageData.qrCode);
  //         setQrCode(messageData.qrCode);
  //       }
  //     } catch (error) {
  //       console.error("Failed to parse message data:", error);
  //     }
  //   }
  // }, [lastMessage]);

  const handleGetQRCode = async () => {
    try {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/whatsapp/getqr`);
      // const { qrcode } = await response.json();
      const { data }: { data: any } = await supabase.from("qrcodes").select("qrcode").order("created_at", { ascending: true });
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
      if (payload.eventType === "INSERT") {
        console.log(payload.new.qrcode);
        setQrCode(payload.new.qrcode);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const channel = supabase.channel("qrcodes").on("postgres_changes", { event: "INSERT", schema: "public", table: "qrcodes" }, setQRCode).subscribe();
    handleGetQRCode();
    return () => {
      channel.unsubscribe();
    }
  }, []);

  return (
    <>
      <Button onClick={() => onOpen()} color="success" radius="full" variant="flat" className="w-10" isIconOnly>
        <IoQrCode />
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Install
              </ModalHeader>
              <ModalBody>
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                  value={qrCode}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  aria-label="close"
                  color="default"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default WhatsAppBot;